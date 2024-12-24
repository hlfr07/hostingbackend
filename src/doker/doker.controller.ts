import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DokerService } from './doker.service';
import { CreateDokerDto } from './dto/create-doker.dto';
import { UpdateDokerDto } from './dto/update-doker.dto';
import { UpdatePasswordmysqlDto } from './dto/update-passwordmysql.dto';
import { UpdateUsermysqlDto } from './dto/update-usermysql.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Doker')
@Controller('doker')
export class DokerController {
  constructor(private readonly dokerService: DokerService) {}

  @Post('/createcontainer/:nombre')
  createDoker(@Param('nombre') nombre: string) {
    return this.dokerService.createContainer(nombre);
  }

  @Post('/startcontainer/:nombre')
  startDoker(@Param('nombre') nombre: string) {
    return this.dokerService.startDocker(nombre);
  }

  @Post('/updatepasswordmysql')
  updatePasswordmysql(@Body() updatePasswordmysqlDto: UpdatePasswordmysqlDto) {
    return this.dokerService.updatePasswordmysql(updatePasswordmysqlDto);
  }

  // @Post('/updateusermysql')
  // updateUsermysql(@Body() updateUsermysqlDto: UpdateUsermysqlDto) {
  //   return this.dokerService.updateUsermysql(updateUsermysqlDto);
  // }

  @Post('/updatepassworpsql')
  updateUserpsql(@Body() UpdatePasswordmysqlDto: UpdatePasswordmysqlDto) {
    return this.dokerService.updatePasswordpsql(UpdatePasswordmysqlDto);
  }

  @Post('/stopcontainer/:nombre')
  stopDoker(@Param('nombre') nombre: string) {
    return this.dokerService.stopDocker(nombre);
  }

  @Post('/extractzip/:zipName/:containerName')
  extractZip(@Param('zipName') zipName: string, @Param('containerName') containerName: string) {
    console.log(zipName, containerName);
    return this.dokerService.extraerzip(zipName, containerName);
  }

  @Post('/carpetadepencie/:carpeta/:containerName')
  zipinstalldepencie(@Param('carpeta') carpeta: string, @Param('containerName') containerName: string) {
     // Decodificar el carpeta para manejar correctamente los espacios y caracteres especiales 
    const decodedCarpeta = decodeURIComponent(carpeta);
    return this.dokerService.zipinstalldepencie(decodedCarpeta, containerName);
  }

  @Post('/startcarpeta/:carpeta/:containerName/:comand')
  start(@Param('carpeta') carpeta: string, @Param('containerName') containerName: string, @Param('comand') comand: string) {
    // Decodificar el comando para manejar correctamente los espacios y caracteres especiales
    const decodedComand = decodeURIComponent(comand);
    const decodedCarpeta = decodeURIComponent(carpeta);
    return this.dokerService.zipstart(decodedCarpeta, containerName, decodedComand);
  }

  @Post('/stopcarpeta/:containerName/:port')
  stopZip(@Param('containerName') containerName: string, @Param('port') port: number) {
    return this.dokerService.stopZip(containerName, port);
  }

  @Delete('/deletecarpeta/:carpeta/:containerName')
  deleteZip(@Param('carpeta') carpeta: string, @Param('containerName') containerName: string) {
    // Decodificar el carpeta para manejar correctamente los espacios y caracteres especiales 
    const decodedCarpeta = decodeURIComponent(carpeta);
    return this.dokerService.deleteFolder(decodedCarpeta, containerName);
  }

  @Post('/startcloudflare/:containerName/:token')
  startCloudflare(@Param('containerName') containerName: string, @Param('token') token: string) {
    return this.dokerService.startserviceCloudflare(containerName, token);
  }

  @Post('/stopcloudflare/:containerName')
  stopCloudflare(@Param('containerName') containerName: string) {
    return this.dokerService.stopServiceCloudflare(containerName);
  }

  @Patch('/updateHtpasswd/:containerName/:user/:password')
  updateHtpasswd(@Param('containerName') containerName: string, @Param('user') user: string, @Param('password') password: string) {
    return this.dokerService.updateHtpasswd(containerName, user, password);
  }

  @Post('/startShellInABox/:containerName')
  startShellInABox(@Param('containerName') containerName: string) {
    return this.dokerService.startShellInABox(containerName);
  }

  @Post('/stopShellInABox/:containerName')
  stopShellInABox(@Param('containerName') containerName: string) {
    return this.dokerService.stopShellInABox(containerName);
  }
}
