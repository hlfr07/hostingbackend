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
exports.PerfilesController = void 0;
const common_1 = require("@nestjs/common");
const perfiles_service_1 = require("./perfiles.service");
const create_perfile_dto_1 = require("./dto/create-perfile.dto");
const update_perfile_dto_1 = require("./dto/update-perfile.dto");
const swagger_1 = require("@nestjs/swagger");
const get_perfile_dto_1 = require("./dto/get-perfile.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles/roles.guard");
const roles_decorator_1 = require("../auth/roles/roles.decorator");
let PerfilesController = class PerfilesController {
    constructor(perfilesService) {
        this.perfilesService = perfilesService;
    }
    create(createPerfileDto) {
        return this.perfilesService.create(createPerfileDto);
    }
    findAll() {
        return this.perfilesService.findAll();
    }
    findOne(id) {
        return this.perfilesService.findOne(+id);
    }
    update(id, updatePerfileDto) {
        return this.perfilesService.update(+id, updatePerfileDto);
    }
    remove(id) {
        return this.perfilesService.remove(+id);
    }
};
exports.PerfilesController = PerfilesController;
__decorate([
    (0, swagger_1.ApiBody)({ type: create_perfile_dto_1.CreatePerfileDto }),
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_perfile_dto_1.CreatePerfileDto]),
    __metadata("design:returntype", void 0)
], PerfilesController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiBody)({ type: [get_perfile_dto_1.GetPerfileDto] }),
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PerfilesController.prototype, "findAll", null);
__decorate([
    (0, swagger_1.ApiBody)({ type: get_perfile_dto_1.GetPerfileDto }),
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PerfilesController.prototype, "findOne", null);
__decorate([
    (0, swagger_1.ApiBody)({ type: create_perfile_dto_1.CreatePerfileDto }),
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_perfile_dto_1.UpdatePerfileDto]),
    __metadata("design:returntype", void 0)
], PerfilesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PerfilesController.prototype, "remove", null);
exports.PerfilesController = PerfilesController = __decorate([
    (0, swagger_1.ApiTags)('Perfiles'),
    (0, common_1.Controller)('perfiles'),
    __metadata("design:paramtypes", [perfiles_service_1.PerfilesService])
], PerfilesController);
//# sourceMappingURL=perfiles.controller.js.map