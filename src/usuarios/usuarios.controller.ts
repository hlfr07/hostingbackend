import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { GetUsuarioDto } from './dto/get-usuario.dto';
import { UpdatePasswordUsuarioDto } from './dto/updatepassword-usuario.dto';
import { UpdatePasswordCodeUsuarioDto } from './dto/updatepasswordcode-usuarios.dto';
import { GetPermisosPorIdUsuarioDto } from './dto/getpermisosporidusuario.dto';
import { Roles } from '../auth/roles/roles.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles/roles.guard';
import { RegistrarseUsuarioDto } from './dto/registrarse-usuario-dto';

@ApiTags('Usuarios')
@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) { }

  @ApiBody({ type: RegistrarseUsuarioDto })
  @Post("/registrarte")
  registrarse(@Body() registrarseUsuarioDto: RegistrarseUsuarioDto) {
    //al registrarse se le asigna el perfil con id 2 que es el de usuario
    const registrarseUsuarioDto2 = { ...registrarseUsuarioDto, id_perfil: "2" };
    return this.usuariosService.create(registrarseUsuarioDto2);
  }

  @ApiBody({ type: CreateUsuarioDto })
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  create(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.usuariosService.create(createUsuarioDto);
  }

  @ApiBody({ type: [GetUsuarioDto] })
  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.usuariosService.findAll();
  }

  @ApiBody({ type: GetUsuarioDto })
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.usuariosService.findOne(+id);
  }

  @ApiBody({ type: UpdateUsuarioDto })
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateUsuarioDto: UpdateUsuarioDto) {
    return this.usuariosService.update(+id, updateUsuarioDto);
  }

  @ApiBody({ type: UpdatePasswordUsuarioDto })
  @Post('/solicitarresetpassword')
  updatePassword(@Body() updatePasswordUsuarioDto: UpdatePasswordUsuarioDto) {
    return this.usuariosService.updatePassword(updatePasswordUsuarioDto);
  }

  @ApiBody({ type: UpdatePasswordCodeUsuarioDto })
  @Patch('/actualizarpassword')
  updatePasswordCode(@Param('dni') dni: string, @Body() updatePasswordCodeUsuarioDto: UpdatePasswordCodeUsuarioDto) {
    return this.usuariosService.updatePasswordCode(updatePasswordCodeUsuarioDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.usuariosService.remove(+id);
  }

}
