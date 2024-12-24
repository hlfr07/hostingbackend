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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcryptjs = require("bcryptjs");
const usuarios_service_1 = require("../usuarios/usuarios.service");
let AuthService = class AuthService {
    constructor(usuarioService, jwtService) {
        this.usuarioService = usuarioService;
        this.jwtService = jwtService;
    }
    async create(createAuthDto) {
        const usuario = await this.usuarioService.buscarParaLogin(createAuthDto.usuario);
        if (!usuario) {
            throw new common_1.UnauthorizedException('Usuario no encontrado');
        }
        const passwordValido = await bcryptjs.compare(createAuthDto.password, usuario.password);
        if (!passwordValido) {
            throw new common_1.UnauthorizedException('Contraseña incorrecta');
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
        const accessToken = await this.jwtService.signAsync(payload, {
            secret: process.env.ACCESS_TOKEN,
            expiresIn: 60 * 60,
        });
        const refreshToken = await this.jwtService.signAsync(payload, {
            secret: process.env.REFRESH_TOKEN,
            expiresIn: 60 * 60 * 24 * 30,
        });
        return {
            token: accessToken,
            refreshToken: refreshToken,
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [usuarios_service_1.UsuariosService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map