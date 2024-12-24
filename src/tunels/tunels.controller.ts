import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TunelsService } from './tunels.service';
import { CreateTunelDto } from './dto/create-tunel.dto';
import { UpdateTunelDto } from './dto/update-tunel.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';

//crearemos el modelo de any que deben enviar para actualizar la config

@ApiTags('Tunels')
@Controller('tunels')
export class TunelsController {
  constructor(private readonly tunelsService: TunelsService) { }

  @Post('/user/:user')
  create(@Param('user') user: string) {
    return this.tunelsService.create(user);
  }

  @Get()
  findAll() {
    return this.tunelsService.findAll();
  }

  @Get('info/:idtunels')
  findOne(@Param('idtunels') id: string) {
    return this.tunelsService.findOne(id);
  }

  @Patch('/updateuser/:idtunels/:userupadte')
  update(@Param('idtunels') id: string, @Param('userupadte') userupadte: string) {
    console.log(id, userupadte);
    return this.tunelsService.update(id, userupadte);
  }

  @Delete(':idtunels')
  remove(@Param('idtunels') id: string) {
    return this.tunelsService.remove(id);
  }

  @Get('/config/:idtunels')
  config(@Param('idtunels') id: string) {
    return this.tunelsService.getConfig(id)
  }

  @ApiBody({ type: UpdateTunelDto })
  @Patch('/config/:idtunels')
  updateConfig(@Param('idtunels') id: string, @Body() updateTunelDto: any) {
    return this.tunelsService.updateConfig(id, updateTunelDto)
  }

  @Get('/dns')
  dns() {
    return this.tunelsService.getDns()
  }

  //ahora vamos a crear un endpoint para crear dns  
  @Post('/dns')
  createDns(@Body() createdns: any) {
    return this.tunelsService.createDns(createdns)
  }

  @Patch('/dns/:id')
  updateDns(@Param('id') id: string, @Body() updateDns: any) {
    return this.tunelsService.updateDns(id, updateDns)
  }

  @Delete('/dns/:id')
  removeDns(@Param('id') id: string) {
    return this.tunelsService.deleteDns(id)
  }
}
