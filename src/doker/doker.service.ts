import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateDokerDto } from './dto/create-doker.dto';
import { UpdateDokerDto } from './dto/update-doker.dto';
import * as Docker from 'dockerode';
import { UpdatePasswordmysqlDto } from './dto/update-passwordmysql.dto';
import { UpdateUsermysqlDto } from './dto/update-usermysql.dto';
import { UpdatePasswordpsqlDto } from './dto/update-passwordpsql.dto';
import { ComandProjecthostDto } from './dto/comandprojecthost.dto';
import { t } from 'tar';

@Injectable()
export class DokerService {

  private docker: Docker;

  constructor() {
    // Inicializamos Dockerode
    this.docker = new Docker();
  }


  async createContainer(username: string): Promise<string> {
    const containerName = `${username}`; // Nombre único basado en el usuario
    const imageName = 'hostingimage:v1.0'; // Nombre de la imagen que creamos previamente

    try {
      const container = await this.docker.createContainer({
        Image: imageName, // Imagen que utilizamos
        name: containerName,
        Tty: true, // Habilitar TTY para terminal interactiva
        Cmd: ['bash'], // Iniciar con bash
        HosConfig: {
          StorageOpt: {
            'size': '10G', // Tamaño del disco
          },
        },
      });

      await container.start(); // Iniciar el contenedor

      return `Contenedor ${containerName} creado y en ejecución.`;
    } catch (error) {
      throw new Error(`Error creando el contenedor: ${error.message}`);
    }
  }

  async startDocker(nombre: string): Promise<string> {
    try {
      // Obtener el contenedor por su nombre
      const container = this.docker.getContainer(nombre);

      // Comprobar si el contenedor está detenido, y si es así, iniciarlo
      const containerInfo = await container.inspect();
      if (containerInfo.State.Status === 'exited' || containerInfo.State.Status === 'created') {
        await container.start();
      }

      // Ejecutar el script /entrypoint.sh dentro del contenedor
      const exec = await container.exec({
        Cmd: ['/bin/bash', '/entrypoint.sh'],
        AttachStdout: true,
        AttachStderr: true,
        Tty: true,
      });

      // Iniciar la ejecución del comando
      const execStream = await exec.start();

      // Creamos un promise de timeout (5 segundos) que permitirá devolver la respuesta inmediatamente
      const timeoutPromise = new Promise<string>((resolve) => {
        setTimeout(() => resolve('Contenedor iniciado correctamente. Los servicios están en ejecución.'), 20000);
      });

      // Usamos Promise.race para lanzar el comando o el timeout
      const result = await Promise.race([this.streamToString(execStream), timeoutPromise]);

      // Verificamos si el resultado contiene algún error conocido
      if (result.includes('ERR') || result.includes('error') || result.includes('failed')) {
        throw new Error(`Error al iniciar el contenedor ${nombre}: ${result}`);
      }

      return result; // Retornar el resultado si no hay errores
    } catch (error) {
      throw new Error(`Error iniciando el contenedor ${nombre}: ${error.message}`);
    }
  }

  // Método auxiliar para convertir el stream de logs en un string
  private async streamToString(stream: NodeJS.ReadableStream): Promise<string> {
    const chunks: Buffer[] = [];
    return new Promise((resolve, reject) => {
      stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
      stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
      stream.on('error', reject);
    });
  }

  //Ahora crearemos un metodo update password
  async updatePasswordmysql(UpdatePasswordmysqlDto: UpdatePasswordmysqlDto): Promise<string> {
    const { containerName, username, newPassword } = UpdatePasswordmysqlDto;
    try {
      const container = this.docker.getContainer(containerName);

      // Comando para actualizar la contraseña en mysql.user
      const updatePasswordCmd = [
        'mysql',
        '-u', 'root',
        `-pMysql6*2024@`,
        '-e', `UPDATE mysql.user SET Password = PASSWORD('${newPassword}') WHERE User = '${username}'; FLUSH PRIVILEGES;`,
      ];

      // Ejecutar el comando en el contenedor
      const exec = await container.exec({
        Cmd: updatePasswordCmd,
        AttachStdout: true,
        AttachStderr: true,
      });

      const execStream = await exec.start();
      const output = await this.streamToString(execStream);

      // Verificar logs para errores comunes
      if (output.includes('ERROR')) {
        throw new Error(output);
      }

      return `Contraseña actualizada correctamente para el usuario ${username}. Logs:\n${output}`;
    } catch (error) {
      throw new Error(
        `Error actualizando la contraseña en el contenedor ${containerName}: ${error.message}`
      );
    }
  }

  // async updateUsermysql(UpdateUsermysqlDto: UpdateUsermysqlDto): Promise<string> {
  //   const { username, currentPassword, newUser, containerName } = UpdateUsermysqlDto;

  //   try {
  //     const container = this.docker.getContainer(containerName);

  //     // Comando para actualizar el nombre de usuario en mysql.user
  //     const updateUsernameCmd = [
  //       'mysql',
  //       '-u', username,
  //       `-p${currentPassword}`,
  //       '-e',
  //       `UPDATE mysql.user SET User = '${newUser}' WHERE User = '${username}'; FLUSH PRIVILEGES;`,
  //     ];

  //     // Ejecutar el comando en el contenedor
  //     const exec = await container.exec({
  //       Cmd: updateUsernameCmd,
  //       AttachStdout: true,
  //       AttachStderr: true,
  //     });

  //     const execStream = await exec.start();
  //     const output = await this.streamToString(execStream);

  //     // Verificar logs para errores comunes
  //     if (output.includes('ERROR')) {
  //       throw new Error(output);
  //     }

  //     return `Nombre de usuario actualizado correctamente de ${username} a ${newUser}. Logs:\n${output}`;
  //   } catch (error) {
  //     throw new Error(
  //       `Error actualizando el nombre de usuario en el contenedor ${containerName}: ${error.message}`
  //     );
  //   }
  // }

  async updatePasswordpsql(UpdatePasswordpsqlDto: UpdatePasswordpsqlDto): Promise<string> {
    const { username, newPassword, containerName } = UpdatePasswordpsqlDto;

    try {
      const container = this.docker.getContainer(containerName);

      // Comando para cambiar la contraseña en PostgreSQL
      const updatePasswordCmd = [
        'sh',
        '-c',
        `PGPASSWORD="Postgresaql@2024*" psql -U postgres -c "ALTER USER \\"${username}\\" WITH PASSWORD '${newPassword}';"`
      ]

      console.log(updatePasswordCmd);
      // Ejecutar el comando en el contenedor
      const exec = await container.exec({
        Cmd: updatePasswordCmd,
        AttachStdout: true,
        AttachStderr: true,
      });

      const execStream = await exec.start();
      const output = await this.streamToString(execStream);

      // Verificar si hubo algún error en la ejecución
      if (output.includes('ERROR')) {
        throw new Error(output);
      }

      return `Contraseña de usuario ${username} actualizada correctamente. Logs:\n${output}`;
    } catch (error) {
      throw new Error(
        `Error actualizando la contraseña en el contenedor ${containerName}: ${error.message}`
      );
    }
  }

  async stopDocker(nombre: string): Promise<string> {
    try {
      // Obtener el contenedor por su nombre
      const container = this.docker.getContainer(nombre);

      // Comprobar si el contenedor está en ejecución, y si es así, detenerlo
      const containerInfo = await container.inspect();
      if (containerInfo.State.Status === 'running') {
        await container.stop();
      }

      return 'Contenedor detenido correctamente.';
    } catch (error) {
      throw new Error(`Error deteniendo el contenedor ${nombre}: ${error.message}`);
    }
  }

  //ahora haremos todo lo relacionado con zip_projects
  async extraerzip(zipName: string, containerName: string): Promise<string> {
    try {
      const container = this.docker.getContainer(containerName);

      // Remover la extensión del archivo ZIP para usarlo como nombre de la carpeta
      const folderName = zipName.replace(/\.zip$/i, '');
      const extractCmd = [
        'sh',
        '-c',
        `
      mkdir -p "/uploads/${folderName}" &&
      unzip -q "/uploads/${zipName}" -d "/uploads/${folderName}" &&
      basename "$(unzip -Z -1 "/uploads/${zipName}" | head -n 1)" &&
      rm -f "/uploads/${zipName}"
      `,
      ];

      // Ejecutar el comando en el contenedor
      const exec = await container.exec({
        Cmd: extractCmd,
        AttachStdout: true,
        AttachStderr: true,
      });

      const execStream = await exec.start();
      const rawOutput = await this.streamToBuffer(execStream);

      // Convertir el stream a texto y limpiar caracteres no deseados
      const output = rawOutput.toString('utf-8').replace(/[^\x20-\x7E]/g, '').trim();

      // Validar salida
      if (!output) {
        throw new Error('La extracción no generó ningún resultado. Verifica el archivo ZIP.');
      }

      return `${folderName}/${output}`;
    } catch (error) {
      throw new Error(
        `Error al extraer el ZIP en el contenedor ${containerName}: ${error.message}`,
      );
    }
  }

  //ahora haremos todo lo relacionado con zip_projects
  async zipinstalldepencie(comandProjecthostDto: ComandProjecthostDto): Promise<{ message: string }> {

    try {
      const container = this.docker.getContainer(comandProjecthostDto.containerName);

      // Comando para entrar a la carpeta y ejecutar npm install
      const installCmd = [
        'bash',  // Usamos bash porque necesitamos ejecutar source
        '-c',
        `source /root/.nvm/nvm.sh && cd /uploads/'${comandProjecthostDto.carpeta}' && ${comandProjecthostDto.comando}`,
      ];

      console.log(installCmd);

      // Ejecutar el comando en el contenedor
      const exec = await container.exec({
        Cmd: installCmd,
        AttachStdout: true,
        AttachStderr: true,
      });

      const execStream = await exec.start();
      const output = await this.streamToString(execStream);

      console.log(output);

      // Verificar salida
      if (output.includes('ERR') || output.includes('error') || output.includes('not found') || output.includes('npm help')) {
        throw new Error(`Error al instalar dependencias en /uploads/${comandProjecthostDto.carpeta}: ${output}`);
      }

      return { message: 'Perfil actualizado correctamente' };
    } catch (error) {
      throw new Error(
        `Error al ejecutar npm install en el contenedor ${comandProjecthostDto.carpeta}: ${error.message}`,
      );
    }
  }

  async zipstart(comandProjecthostDto: ComandProjecthostDto): Promise<{ message: string }> {
    try {
      // Obtener el contenedor por su nombre
      const container = this.docker.getContainer(comandProjecthostDto.containerName);

      // Comprobar si el contenedor está detenido, y si es así, iniciarlo
      const containerInfo = await container.inspect();
      if (containerInfo.State.Status === 'exited' || containerInfo.State.Status === 'created') {
        await container.start();
      }

      const startCmd = [
        'bash',
        '-c',
        `source /root/.nvm/nvm.sh && cd /uploads/${comandProjecthostDto.carpeta} && ${comandProjecthostDto.comando}`,
      ];

      console.log(startCmd);

      // Ejecutar el comando en el contenedor
      const exec = await container.exec({
        Cmd: startCmd,
        AttachStdout: true,
        AttachStderr: true,
        Tty: true,
      });

      // Iniciar la ejecución del comando
      const execStream = await exec.start();

      // Creamos un promise de timeout (5 segundos) que permite responder si el comando tarda mucho
      const timeoutPromise = new Promise<string>((resolve) => {
        setTimeout(() => resolve('Proyecto iniciado... (por favor verifica si el puerto está ocupado)'), 10000);
      });

      // Usamos Promise.race para lanzar el comando o el timeout
      const result = await Promise.race([this.streamToString(execStream), timeoutPromise]);

      // Si el comando genera errores, lo manejamos
      if (result.includes('ERR') || result.includes('error') || result.includes('port already in use') || result.includes('not found') || result.includes('npm help')) {
        throw new Error(`Error al ejecutar el comando "${comandProjecthostDto.comando}" en /uploads/${comandProjecthostDto.carpeta}: ${result}`);
      }

      // Devolver el mensaje, si todo salió bien
      return { message: 'Proyecto iniciado correctamente' };
    } catch (error) {
      throw new Error(`Error iniciando el proyecto: ${error.message}`);
    }
  }

  async stopZip(containerName: string, port: number): Promise<{ message: string }> {
    try {
      // Obtener el contenedor por su nombre
      const container = this.docker.getContainer(containerName);

      // Comprobar si el contenedor está detenido
      const containerInfo = await container.inspect();
      if (containerInfo.State.Status !== 'running') {
        throw new HttpException('El contenedor no está en ejecución', HttpStatus.BAD_REQUEST);
      }

      // Comando para matar el proceso que usa el puerto
      const killCommand = [
        'sh',
        '-c',
        `kill $(lsof -t -i:${port} | grep -v $(pgrep cloudflared))`,
      ];

      // Ejecutar el comando en el contenedor
      const exec = await container.exec({
        Cmd: killCommand,
        AttachStdout: true,
        AttachStderr: true,
        Tty: true,
      });

      const execStream = await exec.start();
      const output = await this.streamToString(execStream);

      // Verificar la salida
      if (output.includes('No such process') || output.includes('not found')) {
        throw new HttpException('No se encontró ningún proceso en el puerto especificado', HttpStatus.NOT_FOUND);
      }

      return { message: 'Proceso detenido correctamente' };
    } catch (error) {
      throw new Error(`Error al detener el proceso en el puerto ${port} dentro del contenedor ${containerName}: ${error.message}`);
    }
  }

  async deleteFolder(carpeta: string, containerName: string): Promise<{ message: string }> {
    try {
      // Obtener el contenedor por su nombre
      const container = this.docker.getContainer(containerName);

      // Comprobar si el contenedor está detenido, y si es así, iniciarlo
      const containerInfo = await container.inspect();
      if (containerInfo.State.Status === 'exited' || containerInfo.State.Status === 'created') {
        await container.start();
      }

      // Comando para eliminar la carpeta
      const deleteCmd = ['sh', '-c', `rm -rf /uploads/'${carpeta}'`];

      // Ejecutar el comando en el contenedor
      const exec = await container.exec({
        Cmd: deleteCmd,
        AttachStdout: true,
        AttachStderr: true,
        Tty: true,
      });

      const execStream = await exec.start();
      const output = await this.streamToString(execStream);

      // Verificar si hubo algún error
      if (output.includes('No such file or directory')) {
        throw new HttpException('La carpeta especificada no existe', HttpStatus.NOT_FOUND);
      }

      return { message: `Carpeta "/uploads/${carpeta}" eliminada correctamente.` };
    } catch (error) {
      throw new Error(`Error eliminando la carpeta "/uploads/${carpeta}": ${error.message}`);
    }
  }


  async startserviceCloudflare(containerName: string, token: string): Promise<{ message: string }> {
    try {
      // Obtener el contenedor por su nombre
      const container = this.docker.getContainer(containerName);

      // Comprobar si el contenedor está detenido, y si es así, iniciarlo
      const containerInfo = await container.inspect();
      if (containerInfo.State.Status === 'exited' || containerInfo.State.Status === 'created') {
        await container.start();
      }

      // Comando para ejecutar cloudflared
      const startCmd = [
        'sh',
        '-c',
        `cloudflared tunnel run --token ${token}`,
      ];

      // Ejecutar el comando en el contenedor
      const exec = await container.exec({
        Cmd: startCmd,
        AttachStdout: true,
        AttachStderr: true,
        Tty: true,
      });

      const execStream = await exec.start();

      // Tiempo de espera antes de asumir que el comando se ejecuta correctamente
      const timeoutPromise = new Promise<string>((resolve) => {
        setTimeout(() => resolve('El servicio Cloudflare se está ejecutando correctamente.'), 5000);
      });

      // Capturar la salida del comando o terminar después del timeout
      const commandOutput = await Promise.race([
        this.streamToString(execStream),
        timeoutPromise,
      ]);

      // Si hay error en la salida, lanzar excepción
      if (commandOutput.includes('ERR') || commandOutput.includes('error')) {
        throw new Error(`Error al iniciar el servicio Cloudflare: ${commandOutput}`);
      }

      return { message: 'Servicio Cloudflare iniciado correctamente.' };
    } catch (error) {
      throw new Error(`Error al iniciar el servicio Cloudflare en el contenedor ${containerName}: ${error.message}`);
    }
  }

  async stopServiceCloudflare(containerName: string): Promise<{ message: string }> {
    try {
      // Obtener el contenedor por su nombre
      const container = this.docker.getContainer(containerName);

      // Comando para detener el servicio de Cloudflare
      const stopCmd = ['sh', '-c', 'pkill -f cloudflared'];

      // Ejecutar el comando dentro del contenedor
      const exec = await container.exec({
        Cmd: stopCmd,
        AttachStdout: true,
        AttachStderr: true,
        Tty: true,
      });

      const execStream = await exec.start();
      const output = await this.streamToString(execStream);

      // Verificar si el comando se ejecutó correctamente
      if (output.includes('No such process')) {
        throw new HttpException('No se encontró ningún proceso de Cloudflare en ejecución', HttpStatus.NOT_FOUND);
      }

      return { message: 'Servicio Cloudflare detenido correctamente.' };
    } catch (error) {
      throw new Error(`Error deteniendo el servicio de Cloudflare: ${error.message}`);
    }
  }

  //servicio para actualizar credenciales de un usuario en un archivo .htpasswd para la autenticación básica de Nginx
  async updateHtpasswd(containerName: string, user: string, password: string): Promise<string> {
    try {
      // Obtener el contenedor por su nombre
      const container = this.docker.getContainer(containerName);

      // Comprobar si el contenedor está detenido, y si es así, iniciarlo
      const containerInfo = await container.inspect();
      if (containerInfo.State.Status === 'exited' || containerInfo.State.Status === 'created') {
        await container.start();
      }

      // Comando para generar/actualizar el archivo .htpasswd
      const htpasswdCmd = ['sh', '-c', `htpasswd -cb /etc/nginx/.htpasswd ${user} "${password}"`];

      // Ejecutar el comando en el contenedor
      const exec = await container.exec({
        Cmd: htpasswdCmd,
        AttachStdout: true,
        AttachStderr: true,
        Tty: true,
      });

      const execStream = await exec.start();
      const output = await this.streamToString(execStream);

      // Verificar si hubo algún error
      if (output.includes('error') || output.includes('ERR')) {
        throw new Error(`Error al generar el archivo .htpasswd: ${output}`);
      }

      return `Archivo .htpasswd actualizado correctamente para el usuario "${user}".`;
    } catch (error) {
      throw new Error(`Error creando el archivo .htpasswd: ${error.message}`);
    }
  }

  async startShellInABox(containerName: string): Promise<string> {
    try {
      // Obtener el contenedor por su nombre
      const container = this.docker.getContainer(containerName);

      // Comprobar si el contenedor está detenido, y si es así, iniciarlo
      const containerInfo = await container.inspect();
      if (containerInfo.State.Status === 'exited' || containerInfo.State.Status === 'created') {
        await container.start();
      }

      // Comando para iniciar shellinaboxd
      const shellInABoxCmd = [
        'sh',
        '-c',
        `shellinaboxd -t -p 8080 -s /:root:root:/uploads/:/bin/bash`,
      ];

      // Ejecutar el comando en el contenedor
      const exec = await container.exec({
        Cmd: shellInABoxCmd,
        AttachStdout: true,
        AttachStderr: true,
        Tty: true,
      });

      const execStream = await exec.start();

      // Tiempo de espera antes de asumir que el comando se ejecuta correctamente
      const timeoutPromise = new Promise<string>((resolve) => {
        setTimeout(() => resolve(`ShellInABox iniciado correctamente en el puerto 8080.`), 5000);
      });

      // Capturar la salida del comando o terminar después del timeout
      const commandOutput = await Promise.race([
        this.streamToString(execStream),
        timeoutPromise,
      ]);

      // Si hay error en la salida, lanzar excepción
      if (commandOutput.includes('ERR') || commandOutput.includes('error')) {
        throw new Error(`Error al iniciar ShellInABox: ${commandOutput}`);
      }

      return `ShellInABox iniciado correctamente en el puerto 8080.`;
    } catch (error) {
      throw new Error(`Error al iniciar ShellInABox en el contenedor ${containerName}: ${error.message}`);
    }
  }

  async stopShellInABox(containerName: string): Promise<string> {
    try {
      // Obtener el contenedor por su nombre
      const container = this.docker.getContainer(containerName);

      // Comando para matar el proceso shellinaboxd
      const killCommand = ['sh', '-c', 'pkill -f shellinaboxd'];

      // Ejecutar el comando en el contenedor
      const exec = await container.exec({
        Cmd: killCommand,
        AttachStdout: true,
        AttachStderr: true,
        Tty: true,
      });

      const execStream = await exec.start();
      const output = await this.streamToString(execStream);

      // Verificar la salida
      if (output.includes('No such process')) {
        return 'No se encontró ningún proceso de ShellInABox en ejecución.';
      }

      return 'Proceso de ShellInABox detenido correctamente.';
    } catch (error) {
      throw new Error(`Error al detener el proceso de ShellInABox: ${error.message}`);
    }
  }

  //ahora crearemos un metodo que nos devolvera en un array la lista de carpetas dentro de uploads
  async listFolder(containerName: string): Promise<string[]> {
    try {
      // Obtener el contenedor por su nombre
      const container = this.docker.getContainer(containerName);

      // Comando para listar las carpetas en /uploads
      const listCmd = ['sh', '-c', 'ls -1 /uploads'];

      // Ejecutar el comando en el contenedor
      const exec = await container.exec({
        Cmd: listCmd,
        AttachStdout: true,
        AttachStderr: true,
      });

      const execStream = await exec.start();

      // Convertir el stream a texto
      const rawOutput = await this.streamToBuffer(execStream);
      let output = rawOutput.toString('utf-8');

      // Eliminar caracteres no imprimibles
      output = output.replace(/[^\x20-\x7E\n]/g, '');

      // Filtrar y formatear la salida
      const folders = output
        .split('\n') // Dividir por líneas
        .map((line) => line.trim()) // Remover espacios innecesarios
        .filter((line) => line.length > 0); // Eliminar líneas vacías

      return folders;
    } catch (error) {
      throw new Error(`Error listando las carpetas en /uploads: ${error.message}`);
    }
  }


  // Método auxiliar para convertir el stream a un buffer
  private async streamToBuffer(stream: NodeJS.ReadableStream): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      stream.on('data', (chunk) => chunks.push(chunk));
      stream.on('end', () => resolve(Buffer.concat(chunks)));
      stream.on('error', (err) => reject(err));
    });
  }

}
