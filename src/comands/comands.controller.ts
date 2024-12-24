import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ComandsService } from './comands.service';
import { CreateComandDto } from './dto/create-comand.dto';
import { UpdateComandDto } from './dto/update-comand.dto';

@Controller('comands')
export class ComandsController {
  constructor(private readonly comandsService: ComandsService) {}

  // @Post()
  // create(@Body() createComandDto: CreateComandDto) {
  //   return this.comandsService.create(createComandDto);
  // }

  // @Get()
  // findAll() {
  //   return this.comandsService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.comandsService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateComandDto: UpdateComandDto) {
  //   return this.comandsService.update(+id, updateComandDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.comandsService.remove(+id);
  // }

  // @Get('/stop/:user')
  // stop(@Param('user') user: string) {
  //   return this.comandsService.stop(user);
  // }

  // @Get('/install/:user/:filename')
  // install(@Param('user') user: string, @Param('filename') filename: string) {
  //   return this.comandsService.installDependencies(user, filename);
  // }

  // @Get('/ports/ocupados/:min/:max')
  // ports(@Param('min') min: number, @Param('max') max: number) {
  //   console.log('Ports');
  //   return this.comandsService.getPortsOcupados(min, max);
  // }

  // @Get('/start/:user/:filename/:comand')
  // start(@Param('user') user: string, @Param('filename') filename: string, @Param('comand') comand: string) {
  //   // Decodificar el comando para manejar correctamente los espacios y caracteres especiales
  // const decodedComand = decodeURIComponent(comand);
  // return this.comandsService.start(user, filename, decodedComand);
  // }

  // @Delete('/terminate/:port')
  // terminate(@Param('port') port: number) {
  //   return this.comandsService.terminate(port);
  // }
}
