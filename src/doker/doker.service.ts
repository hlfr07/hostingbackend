import { Injectable } from '@nestjs/common';
import { CreateDokerDto } from './dto/create-doker.dto';
import { UpdateDokerDto } from './dto/update-doker.dto';
import * as Docker from 'dockerode';
import { UpdatePasswordmysqlDto } from './dto/update-passwordmysql.dto';
import { UpdateUsermysqlDto } from './dto/update-usermysql.dto';
import { UpdatePasswordpsqlDto } from './dto/update-passwordpsql.dto';

@Injectable()
export class DokerService {

  private docker: Docker;

  constructor() {
    // Inicializamos Dockerode
    this.docker = new Docker();
  }


  async createContainer(username: string): Promise<string> {
    const containerName = `${username}`; // Nombre único basado en el usuario
    const imageName = 'hector_image_original:v1.3'; // Nombre de la imagen que creamos previamente

    try {
      const container = await this.docker.createContainer({
        Image: imageName, // Imagen que utilizamos
        name: containerName,
        Tty: true, // Habilitar TTY para terminal interactiva
        Cmd: ['bash'], // Iniciar con bash
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
        setTimeout(() => resolve('Contenedor iniciado correctamente. Los servicios están en ejecución.'), 5000);
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
  async extraerzip(zipName: string, containerName): Promise<string> {
    try {
      const container = this.docker.getContainer(containerName);

      // Comando para extraer el archivo ZIP
      const extractCmd = [
        'sh',
        '-c',
        `
        unzip -q "/uploads/${zipName}.zip" -d "/uploads" &&
        basename "$(unzip -Z -1 "/uploads/${zipName}.zip" | head -n 1)" &&
        rm -f "/uploads/${zipName}.zip"
        `,
      ];

      // Ejecutar el comando en el contenedor
      const exec = await container.exec({
        Cmd: extractCmd,
        AttachStdout: true,
        AttachStderr: true,
      });

      const execStream = await exec.start();
      const output = await this.streamToString(execStream);

      // Validar salida
      if (!output.trim()) {
        throw new Error('La extracción no generó ningún resultado. Verifica el archivo ZIP.');
      }

      return output.trim();
    } catch (error) {
      throw new Error(
        `Error al extraer el ZIP en el contenedor ${containerName}: ${error.message}`,
      );
    }
  }

  //ahora haremos todo lo relacionado con zip_projects
  async zipinstalldepencie(carpeta: string, containerName: string): Promise<string> {
    try {
      const container = this.docker.getContainer(containerName);

      // Comando para entrar a la carpeta y ejecutar npm install
      const installCmd = [
        'sh',
        '-c',
        `cd /uploads/'${carpeta}' && npm install`,
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

      // Verificar salida
      if (output.includes('ERR') || output.includes('error')) {
        throw new Error(`Error al instalar dependencias en /uploads/${carpeta}: ${output}`);
      }

      return `Dependencias instaladas correctamente en /uploads/${carpeta}. Logs:\n${output}`;
    } catch (error) {
      throw new Error(
        `Error al ejecutar npm install en el contenedor ${containerName}: ${error.message}`,
      );
    }
  }

  async zipstart(carpeta: string, containerName: string, comando): Promise<string> {
    try {
      // Obtener el contenedor por su nombre
      const container = this.docker.getContainer(containerName);

      // Comprobar si el contenedor está detenido, y si es así, iniciarlo
      const containerInfo = await container.inspect();
      if (containerInfo.State.Status === 'exited' || containerInfo.State.Status === 'created') {
        await container.start();
      }

      const startCmd = [
        'sh',
        '-c',
        `cd /uploads/'${carpeta}' && ${comando}`,
      ];

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
      if (result.includes('ERR') || result.includes('error') || result.includes('port already in use')) {
        throw new Error(`Error al ejecutar el comando "${comando}" en /uploads/${carpeta}: ${result}`);
      }

      // Devolver el mensaje, si todo salió bien
      return result;
    } catch (error) {
      throw new Error(`Error iniciando el proyecto: ${error.message}`);
    }
  }

  async stopZip(containerName: string, port: number): Promise<string> {
    try {
      // Obtener el contenedor por su nombre
      const container = this.docker.getContainer(containerName);

      // Comprobar si el contenedor está detenido
      const containerInfo = await container.inspect();
      if (containerInfo.State.Status !== 'running') {
        return `El contenedor ${containerName} no está en ejecución.`;
      }

      // Comando para matar el proceso que usa el puerto
      const killCommand = [
        'sh',
        '-c',
        `kill -9 $(lsof -t -i:${port})`,
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
        return `No se encontró ningún proceso ejecutándose en el puerto ${port} dentro del contenedor ${containerName}.`;
      }

      return `El proceso que utilizaba el puerto ${port} en el contenedor ${containerName} fue detenido exitosamente.`;
    } catch (error) {
      throw new Error(`Error al detener el proceso en el puerto ${port} dentro del contenedor ${containerName}: ${error.message}`);
    }
  }

  async deleteFolder(carpeta: string, containerName: string): Promise<string> {
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
        return `La carpeta "/uploads/${carpeta}" no existe o ya fue eliminada.`;
      }

      return `Carpeta "/uploads/${carpeta}" eliminada correctamente.`;
    } catch (error) {
      throw new Error(`Error eliminando la carpeta "/uploads/${carpeta}": ${error.message}`);
    }
  }


  async startserviceCloudflare(containerName: string, token: string): Promise<string> {
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

      return 'El servicio Cloudflare se está ejecutando correctamente.';
    } catch (error) {
      throw new Error(`Error al iniciar el servicio Cloudflare en el contenedor ${containerName}: ${error.message}`);
    }
  }

  async stopServiceCloudflare(containerName: string): Promise<string> {
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
        return 'No se encontró ningún servicio de Cloudflare en ejecución.';
      }

      return 'Servicio de Cloudflare detenido correctamente.';
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


}
