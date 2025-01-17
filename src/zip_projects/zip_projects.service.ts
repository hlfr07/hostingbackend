import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateZipProjectDto } from './dto/create-zip_project.dto';
import { UpdateZipProjectDto } from './dto/update-zip_project.dto';
import * as Docker from 'dockerode';
import * as path from 'path';
import * as fs from 'fs';
import * as tar from 'tar';

@Injectable()
export class ZipProjectsService {

  private docker: Docker;
  
    constructor() {
      // Inicializamos Dockerode
      this.docker = new Docker();
    }

  create(createZipProjectDto: CreateZipProjectDto) {
    return 'This action adds a new zipProject';
  }

  findAll() {
    return `This action returns all zipProjects`;
  }

  findOne(id: number) {
    return `This action returns a #${id} zipProject`;
  }

  update(id: number, updateZipProjectDto: UpdateZipProjectDto) {
    return `This action updates a #${id} zipProject`;
  }

  remove(id: number) {
    return `This action removes a #${id} zipProject`;
  }

  // async zipProjecTDocker(nombre: string, containerName: string): Promise<string> {
  //   try {
  //     // Ruta del archivo ZIP en la máquina anfitriona
  //     const localZipPath = path.join(process.cwd(), 'uploads', containerName, `${nombre}.zip`);

  //     // Verificar si el archivo existe en el sistema local
  //     if (!fs.existsSync(localZipPath)) {
  //       throw new Error(`El archivo ${localZipPath} no existe.`);
  //     }

  //     // Crear un archivo TAR con el archivo ZIP dentro
  //     const tarPath = path.join(process.cwd(), 'uploads', containerName, `${nombre}.tar`);
  //     await tar.create(
  //       {
  //         gzip: false,
  //         file: tarPath,
  //         cwd: path.dirname(localZipPath), // Directorio base
  //       },
  //       [path.basename(localZipPath)] // Solo el archivo ZIP
  //     );

  //     // Obtener el contenedor Docker
  //     const container = this.docker.getContainer(containerName);

  //     // Verificar si el contenedor está en ejecución
  //     const containerInfo = await container.inspect();
  //     if (!containerInfo.State.Running) {
  //       throw new Error(`El contenedor ${containerName} no está en ejecución.`);
  //     }

  //     // Ruta destino dentro del contenedor
  //     const containerDir = '/uploads';

  //     // Crear la carpeta destino si no existe
  //     const mkdirExec = await container.exec({
  //       Cmd: ['mkdir', '-p', containerDir],
  //       AttachStdout: true,
  //       AttachStderr: true,
  //     });
  //     await mkdirExec.start();

  //     // Copiar el archivo TAR al contenedor
  //     const tarStream = fs.createReadStream(tarPath);
  //     await container.putArchive(tarStream, { path: containerDir });

  //     // Limpiar el archivo TAR generado
  //     fs.unlinkSync(tarPath);

  //     return `El archivo ${nombre} se copió correctamente al contenedor ${containerName} en ${containerDir}.`;
  //   } catch (error) {
  //     throw new Error(`Error al copiar el archivo ZIP: ${error.message}`);
  //   }
  // }
}
