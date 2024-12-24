"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsuariosModule = void 0;
const common_1 = require("@nestjs/common");
const usuarios_service_1 = require("./usuarios.service");
const usuarios_controller_1 = require("./usuarios.controller");
const typeorm_1 = require("@nestjs/typeorm");
const usuario_entity_1 = require("./entities/usuario.entity");
const mail_module_1 = require("../mail/mail.module");
const perfile_entity_1 = require("../perfiles/entities/perfile.entity");
const tunels_module_1 = require("../tunels/tunels.module");
const doker_module_1 = require("../doker/doker.module");
let UsuariosModule = class UsuariosModule {
};
exports.UsuariosModule = UsuariosModule;
exports.UsuariosModule = UsuariosModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([usuario_entity_1.Usuario, perfile_entity_1.Perfile]), mail_module_1.MailModule, tunels_module_1.TunelsModule, doker_module_1.DokerModule
        ],
        controllers: [usuarios_controller_1.UsuariosController],
        providers: [usuarios_service_1.UsuariosService],
        exports: [usuarios_service_1.UsuariosService]
    })
], UsuariosModule);
//# sourceMappingURL=usuarios.module.js.map