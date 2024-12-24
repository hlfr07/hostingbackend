"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DokerService = void 0;
const common_1 = require("@nestjs/common");
const Docker = require("dockerode");
let DokerService = class DokerService {
    constructor() {
        this.docker = new Docker();
    }
    async createContainer(username) {
        const containerName = `${username}`;
        const imageName = 'hector_image_original:v1.3';
        try {
            const container = await this.docker.createContainer({
                Image: imageName,
                name: containerName,
                Tty: true,
                Cmd: ['bash'],
            });
            await container.start();
            return `Contenedor ${containerName} creado y en ejecución.`;
        }
        catch (error) {
            throw new Error(`Error creando el contenedor: ${error.message}`);
        }
    }
    async startDocker(nombre) {
        try {
            const container = this.docker.getContainer(nombre);
            const containerInfo = await container.inspect();
            if (containerInfo.State.Status === 'exited' || containerInfo.State.Status === 'created') {
                await container.start();
            }
            const exec = await container.exec({
                Cmd: ['/bin/bash', '/entrypoint.sh'],
                AttachStdout: true,
                AttachStderr: true,
                Tty: true,
            });
            const execStream = await exec.start();
            const timeoutPromise = new Promise((resolve) => {
                setTimeout(() => resolve('Contenedor iniciado correctamente. Los servicios están en ejecución.'), 5000);
            });
            const result = await Promise.race([this.streamToString(execStream), timeoutPromise]);
            if (result.includes('ERR') || result.includes('error') || result.includes('failed')) {
                throw new Error(`Error al iniciar el contenedor ${nombre}: ${result}`);
            }
            return result;
        }
        catch (error) {
            throw new Error(`Error iniciando el contenedor ${nombre}: ${error.message}`);
        }
    }
    async streamToString(stream) {
        const chunks = [];
        return new Promise((resolve, reject) => {
            stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
            stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
            stream.on('error', reject);
        });
    }
    async updatePasswordmysql(UpdatePasswordmysqlDto) {
        const { containerName, username, newPassword } = UpdatePasswordmysqlDto;
        try {
            const container = this.docker.getContainer(containerName);
            const updatePasswordCmd = [
                'mysql',
                '-u', 'root',
                `-pMysql6*2024@`,
                '-e', `UPDATE mysql.user SET Password = PASSWORD('${newPassword}') WHERE User = '${username}'; FLUSH PRIVILEGES;`,
            ];
            const exec = await container.exec({
                Cmd: updatePasswordCmd,
                AttachStdout: true,
                AttachStderr: true,
            });
            const execStream = await exec.start();
            const output = await this.streamToString(execStream);
            if (output.includes('ERROR')) {
                throw new Error(output);
            }
            return `Contraseña actualizada correctamente para el usuario ${username}. Logs:\n${output}`;
        }
        catch (error) {
            throw new Error(`Error actualizando la contraseña en el contenedor ${containerName}: ${error.message}`);
        }
    }
    async updatePasswordpsql(UpdatePasswordpsqlDto) {
        const { username, newPassword, containerName } = UpdatePasswordpsqlDto;
        try {
            const container = this.docker.getContainer(containerName);
            const updatePasswordCmd = [
                'sh',
                '-c',
                `PGPASSWORD="Postgresaql@2024*" psql -U postgres -c "ALTER USER \\"${username}\\" WITH PASSWORD '${newPassword}';"`
            ];
            console.log(updatePasswordCmd);
            const exec = await container.exec({
                Cmd: updatePasswordCmd,
                AttachStdout: true,
                AttachStderr: true,
            });
            const execStream = await exec.start();
            const output = await this.streamToString(execStream);
            if (output.includes('ERROR')) {
                throw new Error(output);
            }
            return `Contraseña de usuario ${username} actualizada correctamente. Logs:\n${output}`;
        }
        catch (error) {
            throw new Error(`Error actualizando la contraseña en el contenedor ${containerName}: ${error.message}`);
        }
    }
    async stopDocker(nombre) {
        try {
            const container = this.docker.getContainer(nombre);
            const containerInfo = await container.inspect();
            if (containerInfo.State.Status === 'running') {
                await container.stop();
            }
            return 'Contenedor detenido correctamente.';
        }
        catch (error) {
            throw new Error(`Error deteniendo el contenedor ${nombre}: ${error.message}`);
        }
    }
    async extraerzip(zipName, containerName) {
        try {
            const container = this.docker.getContainer(containerName);
            const extractCmd = [
                'sh',
                '-c',
                `
        unzip -q "/uploads/${zipName}.zip" -d "/uploads" &&
        basename "$(unzip -Z -1 "/uploads/${zipName}.zip" | head -n 1)" &&
        rm -f "/uploads/${zipName}.zip"
        `,
            ];
            const exec = await container.exec({
                Cmd: extractCmd,
                AttachStdout: true,
                AttachStderr: true,
            });
            const execStream = await exec.start();
            const output = await this.streamToString(execStream);
            if (!output.trim()) {
                throw new Error('La extracción no generó ningún resultado. Verifica el archivo ZIP.');
            }
            return output.trim();
        }
        catch (error) {
            throw new Error(`Error al extraer el ZIP en el contenedor ${containerName}: ${error.message}`);
        }
    }
    async zipinstalldepencie(carpeta, containerName) {
        try {
            const container = this.docker.getContainer(containerName);
            const installCmd = [
                'sh',
                '-c',
                `cd /uploads/'${carpeta}' && npm install`,
            ];
            console.log(installCmd);
            const exec = await container.exec({
                Cmd: installCmd,
                AttachStdout: true,
                AttachStderr: true,
            });
            const execStream = await exec.start();
            const output = await this.streamToString(execStream);
            if (output.includes('ERR') || output.includes('error')) {
                throw new Error(`Error al instalar dependencias en /uploads/${carpeta}: ${output}`);
            }
            return `Dependencias instaladas correctamente en /uploads/${carpeta}. Logs:\n${output}`;
        }
        catch (error) {
            throw new Error(`Error al ejecutar npm install en el contenedor ${containerName}: ${error.message}`);
        }
    }
    async zipstart(carpeta, containerName, comando) {
        try {
            const container = this.docker.getContainer(containerName);
            const containerInfo = await container.inspect();
            if (containerInfo.State.Status === 'exited' || containerInfo.State.Status === 'created') {
                await container.start();
            }
            const startCmd = [
                'sh',
                '-c',
                `cd /uploads/'${carpeta}' && ${comando}`,
            ];
            const exec = await container.exec({
                Cmd: startCmd,
                AttachStdout: true,
                AttachStderr: true,
                Tty: true,
            });
            const execStream = await exec.start();
            const timeoutPromise = new Promise((resolve) => {
                setTimeout(() => resolve('Proyecto iniciado... (por favor verifica si el puerto está ocupado)'), 10000);
            });
            const result = await Promise.race([this.streamToString(execStream), timeoutPromise]);
            if (result.includes('ERR') || result.includes('error') || result.includes('port already in use')) {
                throw new Error(`Error al ejecutar el comando "${comando}" en /uploads/${carpeta}: ${result}`);
            }
            return result;
        }
        catch (error) {
            throw new Error(`Error iniciando el proyecto: ${error.message}`);
        }
    }
    async stopZip(containerName, port) {
        try {
            const container = this.docker.getContainer(containerName);
            const containerInfo = await container.inspect();
            if (containerInfo.State.Status !== 'running') {
                return `El contenedor ${containerName} no está en ejecución.`;
            }
            const killCommand = [
                'sh',
                '-c',
                `kill -9 $(lsof -t -i:${port})`,
            ];
            const exec = await container.exec({
                Cmd: killCommand,
                AttachStdout: true,
                AttachStderr: true,
                Tty: true,
            });
            const execStream = await exec.start();
            const output = await this.streamToString(execStream);
            if (output.includes('No such process') || output.includes('not found')) {
                return `No se encontró ningún proceso ejecutándose en el puerto ${port} dentro del contenedor ${containerName}.`;
            }
            return `El proceso que utilizaba el puerto ${port} en el contenedor ${containerName} fue detenido exitosamente.`;
        }
        catch (error) {
            throw new Error(`Error al detener el proceso en el puerto ${port} dentro del contenedor ${containerName}: ${error.message}`);
        }
    }
    async deleteFolder(carpeta, containerName) {
        try {
            const container = this.docker.getContainer(containerName);
            const containerInfo = await container.inspect();
            if (containerInfo.State.Status === 'exited' || containerInfo.State.Status === 'created') {
                await container.start();
            }
            const deleteCmd = ['sh', '-c', `rm -rf /uploads/'${carpeta}'`];
            const exec = await container.exec({
                Cmd: deleteCmd,
                AttachStdout: true,
                AttachStderr: true,
                Tty: true,
            });
            const execStream = await exec.start();
            const output = await this.streamToString(execStream);
            if (output.includes('No such file or directory')) {
                return `La carpeta "/uploads/${carpeta}" no existe o ya fue eliminada.`;
            }
            return `Carpeta "/uploads/${carpeta}" eliminada correctamente.`;
        }
        catch (error) {
            throw new Error(`Error eliminando la carpeta "/uploads/${carpeta}": ${error.message}`);
        }
    }
    async startserviceCloudflare(containerName, token) {
        try {
            const container = this.docker.getContainer(containerName);
            const containerInfo = await container.inspect();
            if (containerInfo.State.Status === 'exited' || containerInfo.State.Status === 'created') {
                await container.start();
            }
            const startCmd = [
                'sh',
                '-c',
                `cloudflared tunnel run --token ${token}`,
            ];
            const exec = await container.exec({
                Cmd: startCmd,
                AttachStdout: true,
                AttachStderr: true,
                Tty: true,
            });
            const execStream = await exec.start();
            const timeoutPromise = new Promise((resolve) => {
                setTimeout(() => resolve('El servicio Cloudflare se está ejecutando correctamente.'), 5000);
            });
            const commandOutput = await Promise.race([
                this.streamToString(execStream),
                timeoutPromise,
            ]);
            if (commandOutput.includes('ERR') || commandOutput.includes('error')) {
                throw new Error(`Error al iniciar el servicio Cloudflare: ${commandOutput}`);
            }
            return 'El servicio Cloudflare se está ejecutando correctamente.';
        }
        catch (error) {
            throw new Error(`Error al iniciar el servicio Cloudflare en el contenedor ${containerName}: ${error.message}`);
        }
    }
    async stopServiceCloudflare(containerName) {
        try {
            const container = this.docker.getContainer(containerName);
            const stopCmd = ['sh', '-c', 'pkill -f cloudflared'];
            const exec = await container.exec({
                Cmd: stopCmd,
                AttachStdout: true,
                AttachStderr: true,
                Tty: true,
            });
            const execStream = await exec.start();
            const output = await this.streamToString(execStream);
            if (output.includes('No such process')) {
                return 'No se encontró ningún servicio de Cloudflare en ejecución.';
            }
            return 'Servicio de Cloudflare detenido correctamente.';
        }
        catch (error) {
            throw new Error(`Error deteniendo el servicio de Cloudflare: ${error.message}`);
        }
    }
    async updateHtpasswd(containerName, user, password) {
        try {
            const container = this.docker.getContainer(containerName);
            const containerInfo = await container.inspect();
            if (containerInfo.State.Status === 'exited' || containerInfo.State.Status === 'created') {
                await container.start();
            }
            const htpasswdCmd = ['sh', '-c', `htpasswd -cb /etc/nginx/.htpasswd ${user} "${password}"`];
            const exec = await container.exec({
                Cmd: htpasswdCmd,
                AttachStdout: true,
                AttachStderr: true,
                Tty: true,
            });
            const execStream = await exec.start();
            const output = await this.streamToString(execStream);
            if (output.includes('error') || output.includes('ERR')) {
                throw new Error(`Error al generar el archivo .htpasswd: ${output}`);
            }
            return `Archivo .htpasswd actualizado correctamente para el usuario "${user}".`;
        }
        catch (error) {
            throw new Error(`Error creando el archivo .htpasswd: ${error.message}`);
        }
    }
    async startShellInABox(containerName) {
        try {
            const container = this.docker.getContainer(containerName);
            const containerInfo = await container.inspect();
            if (containerInfo.State.Status === 'exited' || containerInfo.State.Status === 'created') {
                await container.start();
            }
            const shellInABoxCmd = [
                'sh',
                '-c',
                `shellinaboxd -t -p 8080 -s /:root:root:/uploads/:/bin/bash`,
            ];
            const exec = await container.exec({
                Cmd: shellInABoxCmd,
                AttachStdout: true,
                AttachStderr: true,
                Tty: true,
            });
            const execStream = await exec.start();
            const timeoutPromise = new Promise((resolve) => {
                setTimeout(() => resolve(`ShellInABox iniciado correctamente en el puerto 8080.`), 5000);
            });
            const commandOutput = await Promise.race([
                this.streamToString(execStream),
                timeoutPromise,
            ]);
            if (commandOutput.includes('ERR') || commandOutput.includes('error')) {
                throw new Error(`Error al iniciar ShellInABox: ${commandOutput}`);
            }
            return `ShellInABox iniciado correctamente en el puerto 8080.`;
        }
        catch (error) {
            throw new Error(`Error al iniciar ShellInABox en el contenedor ${containerName}: ${error.message}`);
        }
    }
    async stopShellInABox(containerName) {
        try {
            const container = this.docker.getContainer(containerName);
            const killCommand = ['sh', '-c', 'pkill -f shellinaboxd'];
            const exec = await container.exec({
                Cmd: killCommand,
                AttachStdout: true,
                AttachStderr: true,
                Tty: true,
            });
            const execStream = await exec.start();
            const output = await this.streamToString(execStream);
            if (output.includes('No such process')) {
                return 'No se encontró ningún proceso de ShellInABox en ejecución.';
            }
            return 'Proceso de ShellInABox detenido correctamente.';
        }
        catch (error) {
            throw new Error(`Error al detener el proceso de ShellInABox: ${error.message}`);
        }
    }
};
exports.DokerService = DokerService;
exports.DokerService = DokerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], DokerService);
//# sourceMappingURL=doker.service.js.map