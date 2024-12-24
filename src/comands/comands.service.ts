import { Injectable } from '@nestjs/common';
import { CreateComandDto } from './dto/create-comand.dto';
import { UpdateComandDto } from './dto/update-comand.dto';
import { exec, execSync, spawn } from 'child_process';
import { join, basename } from 'path';
import { cwd } from 'process';
import * as fs from 'fs';

@Injectable()
export class ComandsService {
  create(createComandDto: CreateComandDto) {
    return 'This action adds a new comand';
  }

  findAll() {
    return `This action returns all comands`;
  }

  findOne(id: number) {
    return `This action returns a #${id} comand`;
  }

  update(id: number, updateComandDto: UpdateComandDto) {
    return `This action updates a #${id} comand`;
  }

  remove(id: number) {
    return `This action removes a #${id} comand`;
  }

  async installDependencies(usuario: string, namefile: string): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!usuario || !namefile) {
        reject('El usuario o el nombre del archivo no pueden estar vacíos.');
        return;
      }

      try {
        // Ruta base para uploads usando cwd()
        const baseDir = join(cwd(), 'uploads', usuario);

        // Ruta al archivo ZIP
        const zipFilePath = join(baseDir, `${namefile}.zip`);

        // Verificar que el archivo ZIP existe
        if (!fs.existsSync(zipFilePath)) {
          reject(`El archivo ZIP no existe en la ruta: ${zipFilePath}`);
          return;
        }

        // Comando para descomprimir el archivo ZIP
        const unzipCommand = `powershell -Command "Expand-Archive -Path '${zipFilePath}' -DestinationPath '${baseDir}' -Force"`;

        // Ejecutar el comando de descompresión
        exec(unzipCommand, (unzipError, unzipStdout, unzipStderr) => {
          if (unzipError) {
            console.error(`Error al descomprimir el archivo: ${unzipError.message}`);
            reject(`Error al descomprimir el archivo: ${unzipError.message}`);
            return;
          }

          if (unzipStderr) {
            console.error(`Error en el stderr al descomprimir: ${unzipStderr}`);
            reject(`Error en el stderr al descomprimir: ${unzipStderr}`);
            return;
          }

          console.log(`Descompresión completada: ${unzipStdout}`);

          // Buscar el directorio descomprimido (usando el patrón del nombre original del proyecto)
          const projectDirPattern = basename(namefile, '.zip').split('-').slice(2).join('-');
          const projectDir = fs.readdirSync(baseDir).find((folder) =>
            fs.lstatSync(join(baseDir, folder)).isDirectory() &&
            folder.startsWith(projectDirPattern)
          );

          if (!projectDir) {
            reject(`No se pudo encontrar el directorio descomprimido para el proyecto: ${projectDirPattern}`);
            return;
          }

          const extractDir = join(baseDir, projectDir);
          console.log(`Directorio de extracción encontrado: ${extractDir}`);

          // Comando para instalar las dependencias
          const installCommand = `cd ${extractDir} && npm install`;

          // Ejecutar `npm install`
          exec(installCommand, (installError, installStdout, installStderr) => {
            if (installError) {
              console.error(`Error al instalar dependencias: ${installError.message}`);
              reject(`Error al instalar dependencias: ${installError.message}`);
              return;
            }

            if (installStderr) {
              console.error(`Error en el stderr al instalar dependencias: ${installStderr}`);
              reject(`Error en el stderr al instalar dependencias: ${installStderr}`);
              return;
            }

            console.log(`Instalación completada: ${installStdout}`);
            resolve(`Dependencias instaladas correctamente en el proyecto ${projectDir}.`);
          });
        });
      } catch (error) {
        console.error(`Error inesperado: ${error.message}`);
        reject(`Error inesperado: ${error.message}`);
      }
    });
  }

  // Método que ejecutará el comando para matar el proceso
  async stop(user: string) {
    return new Promise((resolve, reject) => {
      // Comando para obtener el ProcessId
      const commandGetProcessId = `wmic process where "CommandLine like '%cloudflared%' and CommandLine like '%run ${user}%'" get ProcessId | findstr /r "^[0-9]"`;

      // Ejecutar el comando para obtener el ProcessId
      exec(commandGetProcessId, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error al ejecutar el comando de obtener ProcessId: ${error.message}`);
          reject(`Error al ejecutar el comando: ${error.message}`);
          return;
        }
        if (stderr) {
          console.error(`Error en el stderr: ${stderr}`);
          reject(`Error en el stderr: ${stderr}`);
          return;
        }

        // Obtener el primer ProcessId (si existe)
        const processId = stdout.trim().split('\n')[0]; // Tomamos la primera línea del resultado
        if (processId) {
          // Comando para matar el proceso
          const commandKillProcess = `taskkill /F /PID ${processId}`;

          // Ejecutar el comando para matar el proceso
          exec(commandKillProcess, (killError, killStdout, killStderr) => {
            if (killError) {
              console.error(`Error al ejecutar el comando de matar el proceso: ${killError.message}`);
              reject(`Error al matar el proceso: ${killError.message}`);
              return;
            }
            if (killStderr) {
              console.error(`Error en el stderr al matar el proceso: ${killStderr}`);
              reject(`Error al matar el proceso: ${killStderr}`);
              return;
            }

            // Si se ejecuta correctamente, devolvemos un mensaje
            console.log(`Proceso con ID ${processId} terminado correctamente.`);
            resolve(`Proceso con ID ${processId} terminado correctamente.`);
          });
        } else {
          reject('No se encontraron procesos para matar');
        }
      });
    });
  }

  async getPortsOcupados(min: number, max: number): Promise<number[]> {
    return new Promise((resolve, reject) => {
      // Ejecuta el comando netstat en sistemas Windows para obtener puertos ocupados
      exec('netstat -an | findstr LISTEN', (err, stdout, stderr) => {
        if (err || stderr) {
          reject('Error al obtener puertos ocupados');
          return;
        }

        // Procesa la salida para extraer los puertos ocupados y filtrarlos por el rango
        const puertosOcupados = this.extraerPuertos(stdout, min, max);
        resolve(puertosOcupados);
      });
    });
  }

  // Método para extraer los puertos de la salida de netstat y filtrarlos por el rango
  private extraerPuertos(stdout: string, min: number, max: number): number[] {
    const regex = /(?:0\.0\.0\.0|::):(\d+)/g;  // Regex para extraer puertos
    const matches = [...stdout.matchAll(regex)];
    const puertos: number[] = [];

    matches.forEach(match => {
      const puerto = parseInt(match[1], 10); // Obtenemos el puerto de la primera captura
      if (!isNaN(puerto) && puerto !== 0 && puerto >= min && puerto <= max) {
        puertos.push(puerto); // Solo agregamos el puerto si está dentro del rango
      }
    });

    return puertos; // Devolvemos los puertos ocupados dentro del rango
  }
  
   // Método para ejecutar el comando proporcionado por el usuario
   async start(usuario: string, projectDirName: string, command: string): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!usuario || !projectDirName || !command) {
        reject('El usuario, nombre del proyecto o comando no pueden estar vacíos.');
        return;
      }
  
      try {
        // Ruta base para uploads usando cwd()
        const baseDir = join(cwd(), 'uploads', usuario);
  
        // Ruta al directorio del proyecto usando solo el nombre de la carpeta
        const projectDirPath = join(baseDir, projectDirName);
  
        // Verificar que el directorio del proyecto existe
        if (!fs.existsSync(projectDirPath) || !fs.lstatSync(projectDirPath).isDirectory()) {
          reject(`El directorio del proyecto no existe en la ruta: ${projectDirPath}`);
          return;
        }
  
        console.log(`Directorio del proyecto encontrado: ${projectDirPath}`);
  
        // Formar el comando completo para ejecutar el proyecto
        const startCommand = `${command}`;
  
        // Ejecutar el comando en segundo plano
        const process = spawn(startCommand, {
          cwd: projectDirPath,   // Establecer el directorio de trabajo
          shell: true,            // Habilitar el uso de shell
          stdio: 'ignore'         // Ignorar la salida
        });
  
        // Asegurarse de que el proceso se ejecute correctamente
        process.on('error', (error) => {
          console.error(`Error al ejecutar el comando: ${error.message}`);
          reject(`Error al ejecutar el comando: ${error.message}`);
        });
  
        // Devolver un mensaje de éxito inmediatamente
        resolve(`Comando ejecutado correctamente en segundo plano.`);
        
      } catch (error) {
        console.error(`Error inesperado: ${error.message}`);
        reject(`Error inesperado: ${error.message}`);
      }
    });
  }

  async terminate(port: number): Promise<string> {
    return new Promise((resolve, reject) => {
      // Paso 1: Ejecutar netstat para obtener el PID
      exec(`netstat -ano | findstr :${port}`, (error, stdout, stderr) => {
        if (error || stderr) {
          reject(`Error al ejecutar netstat: ${error?.message || stderr}`);
          return;
        }
  
        // Paso 2: Obtener el PID del primer proceso escuchando en el puerto
        const match = stdout.split('\n')[0];  // Tomamos la primera línea
        const matchArray = match.trim().split(/\s+/); // Dividimos la línea en partes
    
        // El PID debería estar en la última columna (índice 4)
        const pidMatch = matchArray.length > 4 ? matchArray[matchArray.length - 1] : null;
        console.log(`PID encontrado: ${pidMatch}`);
    
        if (!pidMatch) {
          reject(`No se encontró un proceso escuchando en el puerto ${port}.`);
          return;
        }
    
        const pid = parseInt(pidMatch, 10);
    
        // Paso 3: Ejecutar taskkill para matar el proceso
        exec(`taskkill /PID ${pid} /F`, (killError, killStdout, killStderr) => {
          if (killError || killStderr) {
            reject(`Error al matar el proceso con PID ${pid}: ${killError?.message || killStderr}`);
            return;
          }
    
          resolve(`Proceso con PID ${pid} detenido correctamente.`);
        });
      });
    });
  }
}
