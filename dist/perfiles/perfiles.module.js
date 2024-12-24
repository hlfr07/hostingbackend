"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerfilesModule = void 0;
const common_1 = require("@nestjs/common");
const perfiles_service_1 = require("./perfiles.service");
const perfiles_controller_1 = require("./perfiles.controller");
const typeorm_1 = require("@nestjs/typeorm");
const perfile_entity_1 = require("./entities/perfile.entity");
const usuarios_module_1 = require("../usuarios/usuarios.module");
let PerfilesModule = class PerfilesModule {
};
exports.PerfilesModule = PerfilesModule;
exports.PerfilesModule = PerfilesModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([perfile_entity_1.Perfile]), usuarios_module_1.UsuariosModule],
        controllers: [perfiles_controller_1.PerfilesController],
        providers: [perfiles_service_1.PerfilesService],
        exports: [perfiles_service_1.PerfilesService]
    })
], PerfilesModule);
//# sourceMappingURL=perfiles.module.js.map