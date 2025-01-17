import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { DokerService } from './doker.service';
import { CreateDokerDto } from './dto/create-doker.dto';
import { UpdateDokerDto } from './dto/update-doker.dto';
import { UpdatePasswordmysqlDto } from './dto/update-passwordmysql.dto';
import { UpdateUsermysqlDto } from './dto/update-usermysql.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles/roles.guard';
import { Roles } from 'src/auth/roles/roles.decorator';
import { ComandProjecthostDto } from './dto/comandprojecthost.dto';

@ApiTags('Doker')
@Controller('doker')
export class DokerController {
  constructor(private readonly dokerService: DokerService) {}

  @Post('/createcontainer/:nombre')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  createDoker(@Param('nombre') nombre: string) {
    return this.dokerService.createContainer(nombre);
  }

  @Post('/startcontainer/:nombre')
  @UseGuards(JwtAuthGuard)
  startDoker(@Param('nombre') nombre: string) {
    return this.dokerService.startDocker(nombre);
  }

  @Post('/updatepasswordmysql')
  @UseGuards(JwtAuthGuard)
  updatePasswordmysql(@Body() updatePasswordmysqlDto: UpdatePasswordmysqlDto) {
    return this.dokerService.updatePasswordmysql(updatePasswordmysqlDto);
  }

  // @Post('/updateusermysql')
  // updateUsermysql(@Body() updateUsermysqlDto: UpdateUsermysqlDto) {
  //   return this.dokerService.updateUsermysql(updateUsermysqlDto);
  // }

  @Post('/updatepassworpsql')
  @UseGuards(JwtAuthGuard)
  updateUserpsql(@Body() UpdatePasswordmysqlDto: UpdatePasswordmysqlDto) {
    return this.dokerService.updatePasswordpsql(UpdatePasswordmysqlDto);
  }

  @Post('/stopcontainer/:nombre')
  @UseGuards(JwtAuthGuard)
  stopDoker(@Param('nombre') nombre: string) {
    return this.dokerService.stopDocker(nombre);
  }

  @Post('/extractzip/:zipName/:containerName')
  @UseGuards(JwtAuthGuard)
  extractZip(@Param('zipName') zipName: string, @Param('containerName') containerName: string) {
    console.log(zipName, containerName);
    return this.dokerService.extraerzip(zipName, containerName);
  }

  @Post('/carpetadepencie')
  @ApiBody({ type: ComandProjecthostDto })
  @UseGuards(JwtAuthGuard)
  zipinstalldepencie(@Body() comandProjecthostDto: ComandProjecthostDto) {
    return this.dokerService.zipinstalldepencie(comandProjecthostDto);
  }

  @Post('/startcarpeta')
  @ApiBody({ type: ComandProjecthostDto })
  @UseGuards(JwtAuthGuard)
  start(@Body() comandProjecthostDto: ComandProjecthostDto) {
    return this.dokerService.zipstart(comandProjecthostDto);
  }

  @Post('/stopcarpeta/:containerName/:port')
  @UseGuards(JwtAuthGuard)
  stopZip(@Param('containerName') containerName: string, @Param('port') port: number) {
    return this.dokerService.stopZip(containerName, port);
  }

  @Delete('/deletecarpeta/:carpeta/:containerName')
  @UseGuards(JwtAuthGuard)
  deleteZip(@Param('carpeta') carpeta: string, @Param('containerName') containerName: string) {
    // Decodificar el carpeta para manejar correctamente los espacios y caracteres especiales 
    const decodedCarpeta = decodeURIComponent(carpeta);
    return this.dokerService.deleteFolder(decodedCarpeta, containerName);
  }

  @Post('/startcloudflare/:containerName/:token')
  @UseGuards(JwtAuthGuard)
  startCloudflare(@Param('containerName') containerName: string, @Param('token') token: string) {
    return this.dokerService.startserviceCloudflare(containerName, token);
  }

  @Post('/stopcloudflare/:containerName')
  @UseGuards(JwtAuthGuard)
  stopCloudflare(@Param('containerName') containerName: string) {
    return this.dokerService.stopServiceCloudflare(containerName);
  }

  @Patch('/updateHtpasswd/:containerName/:user/:password')
  @UseGuards(JwtAuthGuard)
  updateHtpasswd(@Param('containerName') containerName: string, @Param('user') user: string, @Param('password') password: string) {
    return this.dokerService.updateHtpasswd(containerName, user, password);
  }

  @Post('/startShellInABox/:containerName')
  @UseGuards(JwtAuthGuard)
  startShellInABox(@Param('containerName') containerName: string) {
    return this.dokerService.startShellInABox(containerName);
  }

  @Post('/stopShellInABox/:containerName')
  @UseGuards(JwtAuthGuard)
  stopShellInABox(@Param('containerName') containerName: string) {
    return this.dokerService.stopShellInABox(containerName);
  }

  @Get('listfolder/:containerName')
  @UseGuards(JwtAuthGuard)
  listFolder(@Param('containerName') containerName: string) {
    return this.dokerService.listFolder(containerName);
  }
}
