import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Res, UseGuards } from '@nestjs/common';
import { RaresService } from './rares.service';
import { CreateRareDto } from './dto/create-rare.dto';
import { UpdateRareDto } from './dto/update-rare.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import * as path from 'path';
import * as fs from 'fs';
import { Response } from 'express';
import { cwd } from 'process';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import * as Docker from 'dockerode';
import * as tar from 'tar';
import { JwtAuthGuard } from 'src/auth/jwt-auth/jwt-auth.guard';
@ApiTags('rares')
@Controller('rares')
export class RaresController {

  private docker: Docker;

  constructor(private readonly raresService: RaresService) {
    this.docker = new Docker();
  }

  //
  // @ApiBody({ type: CreateRareDto })
  // @Post()
  // @UseInterceptors(FileInterceptor('file', {
  //   storage: diskStorage({
  //     destination: (req, file, cb) => {
  //       // Extrae el nombre desde el cuerpo de la solicitud
  //       const { usuario } = req.body;

  //       // Crea la ruta de la carpeta en función del usuario proporcionado
  //       const dirPath = path.join(cwd(), 'uploads', usuario);

  //       // Verifica si la carpeta existe; si no, la crea
  //       if (!fs.existsSync(dirPath)) {
  //         fs.mkdirSync(dirPath, { recursive: true });
  //       }

  //       // Devuelve la ruta donde se almacenará el archivo
  //       cb(null, dirPath);
  //     },
  //     filename: (req, file, cb) => {
  //       const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
  //       const sanitizedOriginalName = file.originalname.replace(/\s/g, '-').replace(/[^a-zA-Z0-9.-]/g, '');
  //       const filename = `${uniqueSuffix}-${sanitizedOriginalName}`;
  //       cb(null, filename);
  //     },
  //   }),
  //   fileFilter: (req, file, cb) => {
  //     // Aceptar solo archivos zip o rar
  //     cb(null, true);  // Acepta cualquier archivo sda
  //   },
  // }))
  // create(@UploadedFile() file: Express.Multer.File, @Body() createRareDto: CreateRareDto) {
  //   return this.raresService.create(createRareDto, file.filename);
  // }


  @ApiBody({ type: CreateRareDto })
  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file', {
    storage: multer.memoryStorage(), // Usamos memoria temporal en lugar de disco
    fileFilter: (req, file, cb) => {
      // Aceptar solo archivos ZIP
      if (file.mimetype === 'application/zip' || file.originalname.endsWith('.zip')) {
        cb(null, true);
      } else {
        cb(new Error('Solo se permiten archivos ZIP.'), false);
      }
    },
  }))
  async create(@UploadedFile() file: Express.Multer.File, @Body() createRareDto: CreateRareDto) {
    const { usuario } = createRareDto;

    try {
      const container = this.docker.getContainer(usuario);

      // Verificar si el contenedor está en ejecución
      const containerInfo = await container.inspect();
      if (!containerInfo.State.Running) {
        throw new Error(`El contenedor ${usuario} no está en ejecución.`);
      }

      // Generar un nombre único para el archivo
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
      const sanitizedOriginalName = file.originalname.replace(/\s/g, '-').replace(/[^a-zA-Z0-9.-]/g, '');
      const filename = `${uniqueSuffix}-${sanitizedOriginalName}`;

      // Ruta destino dentro del contenedor
      const containerPath = `/uploads/${filename}`;

      // Crear el directorio si no existe (en el contenedor)
      const mkdirCmd = ['mkdir', '-p', '/uploads'];
      const mkdirExec = await container.exec({
        Cmd: mkdirCmd,
        AttachStdout: true,
        AttachStderr: true,
      });
      await mkdirExec.start();

      // Preparar el archivo para ser enviado como un stream al contenedor
      const tarStream = this.createTarStream(file.buffer, filename);

      // Subir el archivo al contenedor
      await container.putArchive(tarStream, {
        path: '/uploads',
      });

      // Registrar en el servicio o base de datos si es necesario
      return this.raresService.create(createRareDto, filename);
    } catch (error) {
      throw new Error(`Error al cargar el archivo al contenedor del usuario ${usuario}: ${error.message}`);
    }
  }

  /**
   * Crea un stream TAR para empaquetar el archivo en memoria.
   */
  private createTarStream(fileBuffer: Buffer, filename: string): tar.Pack {
    const tar = require('tar-stream');
    const pack = tar.pack();

    pack.entry({ name: filename }, fileBuffer, (err) => {
      if (err) throw err;
      pack.finalize();
    });

    return pack;
  }

  // @Get('download/:nombre/:filename')
  // downloadFile(@Param('nombre') nombre: string, @Param('filename') filename: string, @Res() res: Response) {
  //   const filePath = path.join(cwd(), './uploads', nombre, filename);
  //   res.sendFile(filePath, (err) => {
  //     if (err) {
  //       console.error(err);
  //       return res.status(404).send('File not found');
  //     }
  //   });
  // }

  // @Get()
  // findAll() {
  //   return this.raresService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.raresService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateRareDto: UpdateRareDto) {
  //   return this.raresService.update(+id, updateRareDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.raresService.remove(+id);
  // }
}
