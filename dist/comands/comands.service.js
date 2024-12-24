"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComandsService = void 0;
const common_1 = require("@nestjs/common");
const child_process_1 = require("child_process");
const path_1 = require("path");
const process_1 = require("process");
const fs = require("fs");
let ComandsService = class ComandsService {
    create(createComandDto) {
        return 'This action adds a new comand';
    }
    findAll() {
        return `This action returns all comands`;
    }
    findOne(id) {
        return `This action returns a #${id} comand`;
    }
    update(id, updateComandDto) {
        return `This action updates a #${id} comand`;
    }
    remove(id) {
        return `This action removes a #${id} comand`;
    }
    async installDependencies(usuario, namefile) {
        return new Promise((resolve, reject) => {
            if (!usuario || !namefile) {
                reject('El usuario o el nombre del archivo no pueden estar vacíos.');
                return;
            }
            try {
                const baseDir = (0, path_1.join)((0, process_1.cwd)(), 'uploads', usuario);
                const zipFilePath = (0, path_1.join)(baseDir, `${namefile}.zip`);
                if (!fs.existsSync(zipFilePath)) {
                    reject(`El archivo ZIP no existe en la ruta: ${zipFilePath}`);
                    return;
                }
                const unzipCommand = `powershell -Command "Expand-Archive -Path '${zipFilePath}' -DestinationPath '${baseDir}' -Force"`;
                (0, child_process_1.exec)(unzipCommand, (unzipError, unzipStdout, unzipStderr) => {
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
                    const projectDirPattern = (0, path_1.basename)(namefile, '.zip').split('-').slice(2).join('-');
                    const projectDir = fs.readdirSync(baseDir).find((folder) => fs.lstatSync((0, path_1.join)(baseDir, folder)).isDirectory() &&
                        folder.startsWith(projectDirPattern));
                    if (!projectDir) {
                        reject(`No se pudo encontrar el directorio descomprimido para el proyecto: ${projectDirPattern}`);
                        return;
                    }
                    const extractDir = (0, path_1.join)(baseDir, projectDir);
                    console.log(`Directorio de extracción encontrado: ${extractDir}`);
                    const installCommand = `cd ${extractDir} && npm install`;
                    (0, child_process_1.exec)(installCommand, (installError, installStdout, installStderr) => {
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
            }
            catch (error) {
                console.error(`Error inesperado: ${error.message}`);
                reject(`Error inesperado: ${error.message}`);
            }
        });
    }
    async stop(user) {
        return new Promise((resolve, reject) => {
            const commandGetProcessId = `wmic process where "CommandLine like '%cloudflared%' and CommandLine like '%run ${user}%'" get ProcessId | findstr /r "^[0-9]"`;
            (0, child_process_1.exec)(commandGetProcessId, (error, stdout, stderr) => {
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
                const processId = stdout.trim().split('\n')[0];
                if (processId) {
                    const commandKillProcess = `taskkill /F /PID ${processId}`;
                    (0, child_process_1.exec)(commandKillProcess, (killError, killStdout, killStderr) => {
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
                        console.log(`Proceso con ID ${processId} terminado correctamente.`);
                        resolve(`Proceso con ID ${processId} terminado correctamente.`);
                    });
                }
                else {
                    reject('No se encontraron procesos para matar');
                }
            });
        });
    }
    async getPortsOcupados(min, max) {
        return new Promise((resolve, reject) => {
            (0, child_process_1.exec)('netstat -an | findstr LISTEN', (err, stdout, stderr) => {
                if (err || stderr) {
                    reject('Error al obtener puertos ocupados');
                    return;
                }
                const puertosOcupados = this.extraerPuertos(stdout, min, max);
                resolve(puertosOcupados);
            });
        });
    }
    extraerPuertos(stdout, min, max) {
        const regex = /(?:0\.0\.0\.0|::):(\d+)/g;
        const matches = [...stdout.matchAll(regex)];
        const puertos = [];
        matches.forEach(match => {
            const puerto = parseInt(match[1], 10);
            if (!isNaN(puerto) && puerto !== 0 && puerto >= min && puerto <= max) {
                puertos.push(puerto);
            }
        });
        return puertos;
    }
    async start(usuario, projectDirName, command) {
        return new Promise((resolve, reject) => {
            if (!usuario || !projectDirName || !command) {
                reject('El usuario, nombre del proyecto o comando no pueden estar vacíos.');
                return;
            }
            try {
                const baseDir = (0, path_1.join)((0, process_1.cwd)(), 'uploads', usuario);
                const projectDirPath = (0, path_1.join)(baseDir, projectDirName);
                if (!fs.existsSync(projectDirPath) || !fs.lstatSync(projectDirPath).isDirectory()) {
                    reject(`El directorio del proyecto no existe en la ruta: ${projectDirPath}`);
                    return;
                }
                console.log(`Directorio del proyecto encontrado: ${projectDirPath}`);
                const startCommand = `${command}`;
                const process = (0, child_process_1.spawn)(startCommand, {
                    cwd: projectDirPath,
                    shell: true,
                    stdio: 'ignore'
                });
                process.on('error', (error) => {
                    console.error(`Error al ejecutar el comando: ${error.message}`);
                    reject(`Error al ejecutar el comando: ${error.message}`);
                });
                resolve(`Comando ejecutado correctamente en segundo plano.`);
            }
            catch (error) {
                console.error(`Error inesperado: ${error.message}`);
                reject(`Error inesperado: ${error.message}`);
            }
        });
    }
    async terminate(port) {
        return new Promise((resolve, reject) => {
            (0, child_process_1.exec)(`netstat -ano | findstr :${port}`, (error, stdout, stderr) => {
                if (error || stderr) {
                    reject(`Error al ejecutar netstat: ${error?.message || stderr}`);
                    return;
                }
                const match = stdout.split('\n')[0];
                const matchArray = match.trim().split(/\s+/);
                const pidMatch = matchArray.length > 4 ? matchArray[matchArray.length - 1] : null;
                console.log(`PID encontrado: ${pidMatch}`);
                if (!pidMatch) {
                    reject(`No se encontró un proceso escuchando en el puerto ${port}.`);
                    return;
                }
                const pid = parseInt(pidMatch, 10);
                (0, child_process_1.exec)(`taskkill /PID ${pid} /F`, (killError, killStdout, killStderr) => {
                    if (killError || killStderr) {
                        reject(`Error al matar el proceso con PID ${pid}: ${killError?.message || killStderr}`);
                        return;
                    }
                    resolve(`Proceso con PID ${pid} detenido correctamente.`);
                });
            });
        });
    }
};
exports.ComandsService = ComandsService;
exports.ComandsService = ComandsService = __decorate([
    (0, common_1.Injectable)()
], ComandsService);
//# sourceMappingURL=comands.service.js.map