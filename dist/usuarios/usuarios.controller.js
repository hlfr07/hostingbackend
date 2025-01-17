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
exports.UsuariosController = void 0;
const common_1 = require("@nestjs/common");
const usuarios_service_1 = require("./usuarios.service");
const create_usuario_dto_1 = require("./dto/create-usuario.dto");
const update_usuario_dto_1 = require("./dto/update-usuario.dto");
const swagger_1 = require("@nestjs/swagger");
const get_usuario_dto_1 = require("./dto/get-usuario.dto");
const updatepassword_usuario_dto_1 = require("./dto/updatepassword-usuario.dto");
const updatepasswordcode_usuarios_dto_1 = require("./dto/updatepasswordcode-usuarios.dto");
const roles_decorator_1 = require("../auth/roles/roles.decorator");
const jwt_auth_guard_1 = require("../auth/jwt-auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles/roles.guard");
const registrarse_usuario_dto_1 = require("./dto/registrarse-usuario-dto");
let UsuariosController = class UsuariosController {
    constructor(usuariosService) {
        this.usuariosService = usuariosService;
    }
    registrarse(registrarseUsuarioDto) {
        const registrarseUsuarioDto2 = { ...registrarseUsuarioDto, id_perfil: "2" };
        return this.usuariosService.create(registrarseUsuarioDto2);
    }
    create(createUsuarioDto) {
        return this.usuariosService.create(createUsuarioDto);
    }
    findAll() {
        return this.usuariosService.findAll();
    }
    findOne(id) {
        return this.usuariosService.findOne(+id);
    }
    update(id, updateUsuarioDto) {
        return this.usuariosService.update(+id, updateUsuarioDto);
    }
    updatePassword(updatePasswordUsuarioDto) {
        return this.usuariosService.updatePassword(updatePasswordUsuarioDto);
    }
    updatePasswordCode(dni, updatePasswordCodeUsuarioDto) {
        return this.usuariosService.updatePasswordCode(updatePasswordCodeUsuarioDto);
    }
    remove(id) {
        return this.usuariosService.remove(+id);
    }
    updateEtapa(idusuario, etapa, idproyecto) {
        if (isNaN(+idusuario) || isNaN(+etapa) || isNaN(+idproyecto)) {
            return "Los parametros deben ser numericos";
        }
        return this.usuariosService.updateEtapa(+idusuario, +etapa, +idproyecto);
    }
};
exports.UsuariosController = UsuariosController;
__decorate([
    (0, swagger_1.ApiBody)({ type: registrarse_usuario_dto_1.RegistrarseUsuarioDto }),
    (0, common_1.Post)("/registrarte"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [registrarse_usuario_dto_1.RegistrarseUsuarioDto]),
    __metadata("design:returntype", void 0)
], UsuariosController.prototype, "registrarse", null);
__decorate([
    (0, swagger_1.ApiBody)({ type: create_usuario_dto_1.CreateUsuarioDto }),
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_usuario_dto_1.CreateUsuarioDto]),
    __metadata("design:returntype", void 0)
], UsuariosController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiBody)({ type: [get_usuario_dto_1.GetUsuarioDto] }),
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UsuariosController.prototype, "findAll", null);
__decorate([
    (0, swagger_1.ApiBody)({ type: get_usuario_dto_1.GetUsuarioDto }),
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UsuariosController.prototype, "findOne", null);
__decorate([
    (0, swagger_1.ApiBody)({ type: update_usuario_dto_1.UpdateUsuarioDto }),
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_usuario_dto_1.UpdateUsuarioDto]),
    __metadata("design:returntype", void 0)
], UsuariosController.prototype, "update", null);
__decorate([
    (0, swagger_1.ApiBody)({ type: updatepassword_usuario_dto_1.UpdatePasswordUsuarioDto }),
    (0, common_1.Post)('/solicitarresetpassword'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [updatepassword_usuario_dto_1.UpdatePasswordUsuarioDto]),
    __metadata("design:returntype", void 0)
], UsuariosController.prototype, "updatePassword", null);
__decorate([
    (0, swagger_1.ApiBody)({ type: updatepasswordcode_usuarios_dto_1.UpdatePasswordCodeUsuarioDto }),
    (0, common_1.Patch)('/actualizarpassword'),
    __param(0, (0, common_1.Param)('dni')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, updatepasswordcode_usuarios_dto_1.UpdatePasswordCodeUsuarioDto]),
    __metadata("design:returntype", void 0)
], UsuariosController.prototype, "updatePasswordCode", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UsuariosController.prototype, "remove", null);
__decorate([
    (0, common_1.Patch)('/etapas/:idusuario/:etapa/:idproyecto'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('idusuario')),
    __param(1, (0, common_1.Param)('etapa')),
    __param(2, (0, common_1.Param)('idproyecto')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], UsuariosController.prototype, "updateEtapa", null);
exports.UsuariosController = UsuariosController = __decorate([
    (0, swagger_1.ApiTags)('Usuarios'),
    (0, common_1.Controller)('usuarios'),
    __metadata("design:paramtypes", [usuarios_service_1.UsuariosService])
], UsuariosController);
//# sourceMappingURL=usuarios.controller.js.map