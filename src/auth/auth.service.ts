import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/login-auth.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcryptjs from 'bcryptjs'
import { UsuariosService } from 'src/usuarios/usuarios.service';

@Injectable()
export class AuthService {
  //creamos el constructor para usar el servicio de usuario
  //creamos el constructor para usar el servicio de usuario
  constructor(private readonly usuarioService: UsuariosService,
    private readonly jwtService: JwtService) { }
  async create(createAuthDto: CreateAuthDto) {
    //buscamos el usuario por el nombre
    const usuario = await this.usuarioService.buscarParaLogin(createAuthDto.usuario);

    if (!usuario) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    const passwordValido = await bcryptjs.compare(createAuthDto.password, usuario.password);

    if (!passwordValido) {
      throw new UnauthorizedException('Contraseña incorrecta');
    }

    
    const payload = {
      sub: usuario.id,
      usuario: {
        id: usuario.id,
        usuario: usuario.usuario,
        nombre: usuario.nombre,
        email: usuario.email,
        perfil: usuario.perfil
      },
    };
    // console.log("PERMISOS DE MI USUARIO", payload);
    // console.log(payload.tablas);

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.ACCESS_TOKEN,
      expiresIn: 60 * 60, // 1 hora
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.REFRESH_TOKEN,
      expiresIn: 60 * 60 * 24 * 30, // 30 días
    });

    return {
      token: accessToken,
      refreshToken: refreshToken,
    };
  }
}
