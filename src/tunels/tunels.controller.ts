import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { TunelsService } from './tunels.service';
import { CreateTunelDto } from './dto/create-tunel.dto';
import { UpdateTunelDto } from './dto/update-tunel.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth/jwt-auth.guard';

//crearemos el modelo de any que deben enviar para actualizar la config

@ApiTags('Tunels')
@Controller('tunels')
export class TunelsController {
  constructor(private readonly tunelsService: TunelsService) { }

  @Post('/user/:user')
  @UseGuards(JwtAuthGuard)
  create(@Param('user') user: string) {
    return this.tunelsService.create(user);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.tunelsService.findAll();
  }

  @Get('/info/:idtunels')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('idtunels') id: string) {
    return this.tunelsService.findOne(id);
  }

  @Patch('/updateuser/:idtunels/:userupadte')
  @UseGuards(JwtAuthGuard)
  update(@Param('idtunels') id: string, @Param('userupadte') userupadte: string) {
    console.log(id, userupadte);
    return this.tunelsService.update(id, userupadte);
  }

  @Delete('/:idtunels')
  @UseGuards(JwtAuthGuard)
  remove(@Param('idtunels') id: string) {
    return this.tunelsService.remove(id);
  }

  @Get('/config/:idtunels')
  @UseGuards(JwtAuthGuard)
  config(@Param('idtunels') id: string) {
    return this.tunelsService.getConfig(id)
  }

  @ApiBody({ type: UpdateTunelDto })
  @Patch('/config/:idtunels')
  @UseGuards(JwtAuthGuard)
  updateConfig(@Param('idtunels') id: string, @Body() updateTunelDto: any) {
    return this.tunelsService.updateConfig(id, updateTunelDto)
  }

  @Get('/dns')
  @UseGuards(JwtAuthGuard)
  dns() {
    return this.tunelsService.getDns()
  }

  //ahora vamos a crear un endpoint para crear dns  
  @Post('/dns')
  @UseGuards(JwtAuthGuard)
  createDns(@Body() createdns: any) {
    return this.tunelsService.createDns(createdns)
  }

  @Patch('/dns/:id')
  @UseGuards(JwtAuthGuard)
  updateDns(@Param('id') id: string, @Body() updateDns: any) {
    return this.tunelsService.updateDns(id, updateDns)
  }

  @Delete('/dns/:id')
  @UseGuards(JwtAuthGuard)
  removeDns(@Param('id') id: string) {
    return this.tunelsService.deleteDns(id)
  }

  @Get('/token/:id')
  @UseGuards(JwtAuthGuard)
  token(@Param('id') id: string) {
    return this.tunelsService.getToken(id)
  }
}
