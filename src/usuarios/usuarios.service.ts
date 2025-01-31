import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity';
import { Repository } from 'typeorm';
import * as bcryptjs from 'bcryptjs';
import { UpdatePasswordUsuarioDto } from './dto/updatepassword-usuario.dto';
import { MailService } from '../mail/mail.service';
import { UpdatePasswordCodeUsuarioDto } from './dto/updatepasswordcode-usuarios.dto';
import { Perfile } from 'src/perfiles/entities/perfile.entity';
import { TunelsService } from 'src/tunels/tunels.service';
import { DokerService } from 'src/doker/doker.service';

@Injectable()
export class UsuariosService {
  constructor(@InjectRepository(Usuario) private usuarioRepository: Repository<Usuario>, private readonly mailService: MailService, @InjectRepository(Perfile) private perfileRepository: Repository<Perfile>, private readonly tunelsService: TunelsService, private readonly dokerService: DokerService) { }
  async create(createUsuarioDto: CreateUsuarioDto) {

    const usuarioEncontrado = await this.usuarioRepository.findOneBy({
      usuario: createUsuarioDto.usuario
    });

    const emailEncontrado = await this.usuarioRepository.findOneBy({
      email: createUsuarioDto.email
    });

    //buscamos si el id_perfil existe
    const perfilEncontrado = await this.perfileRepository.findOneBy({
      id: parseInt(createUsuarioDto.id_perfil)
    });

    if (!perfilEncontrado) {
      throw new HttpException('Perfil no encontrado', HttpStatus.NOT_FOUND);
    }

    if (emailEncontrado) {
      throw new HttpException('El email ya existe', HttpStatus.BAD_REQUEST);
    }

    if (usuarioEncontrado) {
      throw new HttpException('El usuario ya existe', HttpStatus.BAD_REQUEST);
    }

    //ahora antes de crear el usuario, vamos a enviar un correo de bienvenida al usuario
    //ahora vamos a enviar un correo de bienvenida al usuario
    const emailContent = `
                        <html>
                        <head>
                        <style>
                        body {
                          font-family: Arial, sans-serif;
                          background-color: #f4f4f4;
                          color: #333;
                          padding: 20px;
                        }
                        .container {
                          background-color: #fff;
                          padding: 20px;
                          border-radius: 5px;
                          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                        }
                        .header {
                          background-color: #4CAF50;
                          color: white;
                          padding: 10px;
                          text-align: center;
                          border-radius: 5px 5px 0 0;
                        }
                        .content {
                          margin-top: 20px;
                        }
                        .footer {
                          margin-top: 20px;
                          text-align: center;
                          font-size: 12px;
                          color: #777;
                        }
                        </style>
                        </head>
                        <body>
                        <div class="container">
                        <div class="header">
                          <h1>Bienvenido</h1>
                        </div>
                        <div class="content">
                          <p>Hola, <strong>${createUsuarioDto.nombre}</strong></p>
                          <p>Gracias por registrarte en nuestro sistema.</p>
                          <p>Esperamos que disfrutes de nuestros servicios.</p>
                        </div>
                        <div class="footer">
                          <p>© 2023 RG SERVICIOS GENERALES. Todos los derechos reservados.</p>
                        </div>
                        </div>
                        </body>
                        </html>
    `

    await this.mailService.sendMail(createUsuarioDto.email, 'Bienvenido', emailContent); //si hay un error en el envio del correo, el usuario no se creara

    //ahora vamos a crear el tunel para el usuario
    const tunel = await this.tunelsService.create(createUsuarioDto.usuario);

    if (!tunel || tunel === null || tunel === undefined) {
      throw new HttpException('Error al crear el tunel', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    //ahora llamamos al createContainer del dokerService para crear el contenedor del usuario
    await this.dokerService.createContainer(createUsuarioDto.usuario);

    //ahora llamamos al startDocker del dokerService para iniciar el contenedor del usuario
    await this.dokerService.startDocker(createUsuarioDto.usuario);

    const updatePasswordDto = {
      username: "user",
      newPassword: createUsuarioDto.password,
      containerName: createUsuarioDto.usuario
    }

    //ahora llamaos al updatepassword de mysql y postgresql del dokerService
    await this.dokerService.updatePasswordmysql(updatePasswordDto);

    //ahora llamamos al updatepassword de mysql y postgresql del dokerService
    await this.dokerService.updatePasswordpsql(updatePasswordDto);

    //ahora llamamos al createHtpasswd del dokerService para crear el usuario y contraseña en el archivo htpasswd
    await this.dokerService.updateHtpasswd(createUsuarioDto.usuario, createUsuarioDto.usuario, createUsuarioDto.password);

    //ahora usaremos el metodo updateConfig para actualizar el archivo de configuracion del usuario
    const updateConfigDto = {
      "config": {
        "ingress": [
          {
            "service": "http://localhost:1000",
            "hostname": `${createUsuarioDto.usuario}.theinnovatesoft.xyz`,
            "originRequest": {}
          },
          {
            "service": "http://localhost:80",
            "hostname": `bd_${createUsuarioDto.usuario}.theinnovatesoft.xyz`,
            "originRequest": {}
          },
          {
            "service": "http_status:404"
          }
        ],
        "warp-routing": {
          "enabled": false
        }
      }
    }

    await this.tunelsService.updateConfig(tunel.tunnelId, updateConfigDto);

    //ahora obtendremos el token del tunel
    const token = await this.tunelsService.getToken(tunel.tunnelId);

    //ahora llamamos a startserviceCloudflare del dokerService para iniciar el servicio de cloudflare
    await this.dokerService.startserviceCloudflare(createUsuarioDto.usuario,token.token);

    //y por ultimo el startShellInABox del dokerService para iniciar el servicio de shellinabox
    await this.dokerService.startShellInABox(createUsuarioDto.usuario);

    //ahora pasamos a crear el usuario pero con el password encriptado
    const nuevoUsuario = this.usuarioRepository.create({
      nombre: createUsuarioDto.nombre,
      email: createUsuarioDto.email,
      usuario: createUsuarioDto.usuario,
      password: await bcryptjs.hash(createUsuarioDto.password, 10),
      perfil: perfilEncontrado,
      id_tunel: tunel.tunnelId
    });

    await this.usuarioRepository.save(nuevoUsuario);

    return nuevoUsuario;
  }

  findAll() {
    const usuarios = this.usuarioRepository.find({
      order: { id: 'DESC' }
    });

    return usuarios;
  }

  async findOne(id: number) {
    const usuario = await this.usuarioRepository.findOneBy({
      id: id
    });

    if (!usuario) {
      throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    }

    if (!usuario.estado) {
      throw new HttpException('Usuario eliminado', HttpStatus.BAD_REQUEST);
    }

    return usuario;
  }

  async update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    const usuarioEncontrado = await this.usuarioRepository.findOneBy({
      id: id,
    });

    if (!usuarioEncontrado) {
      throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    }

    //verificamos que el id_perfil exista
    const perfilEncontrado = await this.perfileRepository.findOneBy({
      id: parseInt(updateUsuarioDto.id_perfil)
    });

    if (!perfilEncontrado) {
      throw new HttpException('Perfil no encontrado', HttpStatus.NOT_FOUND);
    }

    //comprobar la existencia del usuario, email con el mismo nombre solo si el nombre es diferente

    if (updateUsuarioDto.email !== usuarioEncontrado.email) {
      const emailEncontrado = await this.usuarioRepository.findOneBy({
        email: updateUsuarioDto.email
      });

      if (emailEncontrado) {
        throw new HttpException('El email ya existe', HttpStatus.BAD_REQUEST);
      }
    }

    // if (updateUsuarioDto.usuario !== usuarioEncontrado.usuario) {
    //   const usuarioEncontrado = await this.usuarioRepository.findOneBy({
    //     usuario: updateUsuarioDto.usuario
    //   });

    //   if (usuarioEncontrado) {
    //     throw new HttpException('El usuario ya existe', HttpStatus.BAD_REQUEST);
    //   }
    // }

    await this.usuarioRepository.update(id, {
      nombre: updateUsuarioDto.nombre,
      email: updateUsuarioDto.email,
      usuario: usuarioEncontrado.usuario,
      password: usuarioEncontrado.password,
      perfil: perfilEncontrado
    });

    return { message: 'Usuario actualizado correctamente' };
  }

  //creamos el servicio para actualizar la contraseña
  async updatePassword(UpdatePasswordUsuarioDto: UpdatePasswordUsuarioDto) {
    //buscamos el usuario por el email
    const usuarioEncontrado = await this.usuarioRepository.findOneBy({
      email: UpdatePasswordUsuarioDto.email,
      estado: true
    });

    if (!usuarioEncontrado) {
      return { message: 'Usuario no encontrado' };
    }

    if (!usuarioEncontrado.estado) {
      return { message: 'Usuario no encontrado' };
    }

    //generamos un codigo de  verificacion de 6 digitos
    const codigoVerificacion = Math.floor(100000 + Math.random() * 900000);

    // Establecer la expiración del código (por ejemplo, 5 minutos)
    const expiracion = new Date();
    expiracion.setMinutes(expiracion.getMinutes() + 5);

    //actualizamos el usuario con el codigo de verificacion y la expiracion
    await this.usuarioRepository.update(usuarioEncontrado.id, {
      resetCode: codigoVerificacion.toString(),
      resetCodeExpiration: expiracion
    });

    //ahpra vamos a mejorar la fecha y hora para enviar por correo: de esto Sat Sep 14 2024 17:36:38 a esto 14/09/2024 17:36:38, en una const expiracionformat
    const expiracionFormat = expiracion.getDate() + '/' + (expiracion.getMonth() + 1) + '/' + expiracion.getFullYear() + ' ' + expiracion.getHours() + ':' + expiracion.getMinutes() + ':' + expiracion.getSeconds();

    //ahora enviamos el dni que corresponde al usaurio y un codigo de verificacion al correo del usuario usando mail service y en el conten haremos una vusta bonita
    const emailContent = `
                        <html>
                        <head>
                        <style>
                        body {
                          font-family: Arial, sans-serif;
                          background-color: #f4f4f4;
                          color: #333;
                          padding: 20px;
                        }
                        .container {
                          background-color: #fff;
                          padding: 20px;
                          border-radius: 5px;
                          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                        }
                        .header {
                          background-color: #4CAF50;
                          color: white;
                          padding: 10px;
                          text-align: center;
                          border-radius: 5px 5px 0 0;
                        }
                        .content {
                          margin-top: 20px;
                        }
                        .footer {
                          margin-top: 20px;
                          text-align: center;
                          font-size: 12px;
                          color: #777;
                        }
                        </style>
                        </head>
                        <body>
                        <div class="container">
                        <div class="header">
                          <h1>Cambio de Contraseña</h1>
                        </div>
                        <div class="content">
                          <p>Hola, <strong>${usuarioEncontrado.nombre}</strong> con <strong>USUARIO: ${usuarioEncontrado.usuario}</strong></p>
                          <p>Hemos recibido una solicitud para cambiar la contraseña de tu cuenta. Tienes <strong>5 minutos</strong> hasta que el codigo expire.</p>
                          <p>Tu código de verificación es: <strong>${codigoVerificacion}</strong></p>
                          <p>Este código expirará el: <strong>${expiracionFormat}</strong></p>
                          <p>Si no solicitaste este cambio, por favor ignora este correo.</p>
                        </div>
                        <div class="footer">
                          <p>© 2023 RG SERVICIOS GENERALES. Todos los derechos reservados.</p>
                        </div>
                        </div>
                        </body>
                        </html>
`

    await this.mailService.sendMail(UpdatePasswordUsuarioDto.email, 'Cambio de contraseña', emailContent);

    return { message: 'Codigo de verificacion enviado al correo' };
  }

  //creamos el servicio para actualizar la contraseña
  async updatePasswordCode(UpdatePasswordCodeUsuarioDto: UpdatePasswordCodeUsuarioDto) {
    const usuarioEncontrado = await this.usuarioRepository.findOneBy({
      resetCode: UpdatePasswordCodeUsuarioDto.resetCode,
      estado: true
    });

    if (!usuarioEncontrado) {
      return { message: 'Usuario no encontrado' };
    }

    if (!usuarioEncontrado.estado) {
      return { message: 'Usuario eliminado' };
    }

    //ahora verificamos si el codigo de verificacion ha expirado
    if (new Date() > usuarioEncontrado.resetCodeExpiration) {
      return { message: 'Codigo de verificacion expirado' };
    }

    //ahora pasamos a actualizar la contraseña del usuario
    await this.usuarioRepository.update(usuarioEncontrado.id, {
      password: await bcryptjs.hash(UpdatePasswordCodeUsuarioDto.password, 10),
      resetCode: null,
      resetCodeExpiration: null
    });

    //ahora llamamos al updateHtpasswd del dokerService para actualizar el usuario y contraseña en el archivo htpasswd
    await this.dokerService.updateHtpasswd(usuarioEncontrado.usuario, usuarioEncontrado.usuario, UpdatePasswordCodeUsuarioDto.password);

    return { message: 'Contraseña actualizada correctamente' };
  }

  async remove(id: number) {
    const usuarioEncontrado = await this.usuarioRepository.findOneBy({
      id: id,
      estado: true
    });

    if (!usuarioEncontrado) {
      return { message: 'Usuario no encontrado' };
    }

    if (!usuarioEncontrado.estado) {
      return { message: 'Usuario eliminado' };
    }

    await this.usuarioRepository.update(id, { estado: false });

    return { message: 'Usuario eliminado correctamente' };
  }

  buscarParaLogin(usuario: string) {
    return this.usuarioRepository.findOne({
      where: {
        usuario: usuario,
        estado: true
      },
      select: ["id", "usuario", "nombre", "email", "password"]
    });
  }

  async updateEtapa(id: number, etapa: number, id_proyecto: number) {
    //buscamos el usuario por el id
    const usuarioEncontrado = await this.usuarioRepository.findOneBy({
      id: id,
      estado: true
    });

    if (!usuarioEncontrado) {
      throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    }

    //verificamos que la etapa sea un entero entre 0 y 4 
    if (etapa < 0 || etapa > 4) {
      throw new HttpException('Etapa no valida', HttpStatus.BAD_REQUEST);
    }

    //actualizamos la etapa del usuario
    await this.usuarioRepository.update(id, {
      etapa: etapa,
      id_proyecto: id_proyecto.toString()
    });

    return { message: 'Etapa actualizada correctamente' };
  }
  

}
