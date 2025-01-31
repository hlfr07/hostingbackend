"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsuariosService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const usuario_entity_1 = require("./entities/usuario.entity");
const typeorm_2 = require("typeorm");
const bcryptjs = require("bcryptjs");
const mail_service_1 = require("../mail/mail.service");
const perfile_entity_1 = require("../perfiles/entities/perfile.entity");
const tunels_service_1 = require("../tunels/tunels.service");
const doker_service_1 = require("../doker/doker.service");
let UsuariosService = class UsuariosService {
    constructor(usuarioRepository, mailService, perfileRepository, tunelsService, dokerService) {
        this.usuarioRepository = usuarioRepository;
        this.mailService = mailService;
        this.perfileRepository = perfileRepository;
        this.tunelsService = tunelsService;
        this.dokerService = dokerService;
    }
    async create(createUsuarioDto) {
        const usuarioEncontrado = await this.usuarioRepository.findOneBy({
            usuario: createUsuarioDto.usuario
        });
        const emailEncontrado = await this.usuarioRepository.findOneBy({
            email: createUsuarioDto.email
        });
        const perfilEncontrado = await this.perfileRepository.findOneBy({
            id: parseInt(createUsuarioDto.id_perfil)
        });
        if (!perfilEncontrado) {
            throw new common_1.HttpException('Perfil no encontrado', common_1.HttpStatus.NOT_FOUND);
        }
        if (emailEncontrado) {
            throw new common_1.HttpException('El email ya existe', common_1.HttpStatus.BAD_REQUEST);
        }
        if (usuarioEncontrado) {
            throw new common_1.HttpException('El usuario ya existe', common_1.HttpStatus.BAD_REQUEST);
        }
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
    `;
        await this.mailService.sendMail(createUsuarioDto.email, 'Bienvenido', emailContent);
        const tunel = await this.tunelsService.create(createUsuarioDto.usuario);
        if (!tunel || tunel === null || tunel === undefined) {
            throw new common_1.HttpException('Error al crear el tunel', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        await this.dokerService.createContainer(createUsuarioDto.usuario);
        await this.dokerService.startDocker(createUsuarioDto.usuario);
        const updatePasswordDto = {
            username: "user",
            newPassword: createUsuarioDto.password,
            containerName: createUsuarioDto.usuario
        };
        await this.dokerService.updatePasswordmysql(updatePasswordDto);
        await this.dokerService.updatePasswordpsql(updatePasswordDto);
        await this.dokerService.updateHtpasswd(createUsuarioDto.usuario, createUsuarioDto.usuario, createUsuarioDto.password);
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
        };
        await this.tunelsService.updateConfig(tunel.tunnelId, updateConfigDto);
        const token = await this.tunelsService.getToken(tunel.tunnelId);
        await this.dokerService.startserviceCloudflare(createUsuarioDto.usuario, token.token);
        await this.dokerService.startShellInABox(createUsuarioDto.usuario);
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
    async findOne(id) {
        const usuario = await this.usuarioRepository.findOneBy({
            id: id
        });
        if (!usuario) {
            throw new common_1.HttpException('Usuario no encontrado', common_1.HttpStatus.NOT_FOUND);
        }
        if (!usuario.estado) {
            throw new common_1.HttpException('Usuario eliminado', common_1.HttpStatus.BAD_REQUEST);
        }
        return usuario;
    }
    async update(id, updateUsuarioDto) {
        const usuarioEncontrado = await this.usuarioRepository.findOneBy({
            id: id,
        });
        if (!usuarioEncontrado) {
            throw new common_1.HttpException('Usuario no encontrado', common_1.HttpStatus.NOT_FOUND);
        }
        const perfilEncontrado = await this.perfileRepository.findOneBy({
            id: parseInt(updateUsuarioDto.id_perfil)
        });
        if (!perfilEncontrado) {
            throw new common_1.HttpException('Perfil no encontrado', common_1.HttpStatus.NOT_FOUND);
        }
        if (updateUsuarioDto.email !== usuarioEncontrado.email) {
            const emailEncontrado = await this.usuarioRepository.findOneBy({
                email: updateUsuarioDto.email
            });
            if (emailEncontrado) {
                throw new common_1.HttpException('El email ya existe', common_1.HttpStatus.BAD_REQUEST);
            }
        }
        await this.usuarioRepository.update(id, {
            nombre: updateUsuarioDto.nombre,
            email: updateUsuarioDto.email,
            usuario: usuarioEncontrado.usuario,
            password: usuarioEncontrado.password,
            perfil: perfilEncontrado
        });
        return { message: 'Usuario actualizado correctamente' };
    }
    async updatePassword(UpdatePasswordUsuarioDto) {
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
        const codigoVerificacion = Math.floor(100000 + Math.random() * 900000);
        const expiracion = new Date();
        expiracion.setMinutes(expiracion.getMinutes() + 5);
        await this.usuarioRepository.update(usuarioEncontrado.id, {
            resetCode: codigoVerificacion.toString(),
            resetCodeExpiration: expiracion
        });
        const expiracionFormat = expiracion.getDate() + '/' + (expiracion.getMonth() + 1) + '/' + expiracion.getFullYear() + ' ' + expiracion.getHours() + ':' + expiracion.getMinutes() + ':' + expiracion.getSeconds();
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
`;
        await this.mailService.sendMail(UpdatePasswordUsuarioDto.email, 'Cambio de contraseña', emailContent);
        return { message: 'Codigo de verificacion enviado al correo' };
    }
    async updatePasswordCode(UpdatePasswordCodeUsuarioDto) {
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
        if (new Date() > usuarioEncontrado.resetCodeExpiration) {
            return { message: 'Codigo de verificacion expirado' };
        }
        await this.usuarioRepository.update(usuarioEncontrado.id, {
            password: await bcryptjs.hash(UpdatePasswordCodeUsuarioDto.password, 10),
            resetCode: null,
            resetCodeExpiration: null
        });
        await this.dokerService.updateHtpasswd(usuarioEncontrado.usuario, usuarioEncontrado.usuario, UpdatePasswordCodeUsuarioDto.password);
        return { message: 'Contraseña actualizada correctamente' };
    }
    async remove(id) {
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
    buscarParaLogin(usuario) {
        return this.usuarioRepository.findOne({
            where: {
                usuario: usuario,
                estado: true
            },
            select: ["id", "usuario", "nombre", "email", "password"]
        });
    }
    async updateEtapa(id, etapa, id_proyecto) {
        const usuarioEncontrado = await this.usuarioRepository.findOneBy({
            id: id,
            estado: true
        });
        if (!usuarioEncontrado) {
            throw new common_1.HttpException('Usuario no encontrado', common_1.HttpStatus.NOT_FOUND);
        }
        if (etapa < 0 || etapa > 4) {
            throw new common_1.HttpException('Etapa no valida', common_1.HttpStatus.BAD_REQUEST);
        }
        await this.usuarioRepository.update(id, {
            etapa: etapa,
            id_proyecto: id_proyecto.toString()
        });
        return { message: 'Etapa actualizada correctamente' };
    }
};
exports.UsuariosService = UsuariosService;
exports.UsuariosService = UsuariosService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(usuario_entity_1.Usuario)),
    __param(2, (0, typeorm_1.InjectRepository)(perfile_entity_1.Perfile)),
    __metadata("design:paramtypes", [typeorm_2.Repository, mail_service_1.MailService, typeorm_2.Repository, tunels_service_1.TunelsService, doker_service_1.DokerService])
], UsuariosService);
//# sourceMappingURL=usuarios.service.js.map