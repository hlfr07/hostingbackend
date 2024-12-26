"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DokerModule = void 0;
const common_1 = require("@nestjs/common");
const doker_service_1 = require("./doker.service");
const doker_controller_1 = require("./doker.controller");
const usuarios_module_1 = require("../usuarios/usuarios.module");
let DokerModule = class DokerModule {
};
exports.DokerModule = DokerModule;
exports.DokerModule = DokerModule = __decorate([
    (0, common_1.Module)({
        imports: [(0, common_1.forwardRef)(() => usuarios_module_1.UsuariosModule)],
        controllers: [doker_controller_1.DokerController],
        providers: [doker_service_1.DokerService],
        exports: [doker_service_1.DokerService]
    })
], DokerModule);
//# sourceMappingURL=doker.module.js.map