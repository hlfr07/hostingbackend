"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RaresModule = void 0;
const common_1 = require("@nestjs/common");
const rares_service_1 = require("./rares.service");
const rares_controller_1 = require("./rares.controller");
const typeorm_1 = require("@nestjs/typeorm");
const zip_project_entity_1 = require("../zip_projects/entities/zip_project.entity");
const usuario_entity_1 = require("../usuarios/entities/usuario.entity");
const tunels_module_1 = require("../tunels/tunels.module");
let RaresModule = class RaresModule {
};
exports.RaresModule = RaresModule;
exports.RaresModule = RaresModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([zip_project_entity_1.ZipProject, usuario_entity_1.Usuario]), tunels_module_1.TunelsModule],
        controllers: [rares_controller_1.RaresController],
        providers: [rares_service_1.RaresService],
        exports: [rares_service_1.RaresService]
    })
], RaresModule);
//# sourceMappingURL=rares.module.js.map