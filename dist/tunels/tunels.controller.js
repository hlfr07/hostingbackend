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
exports.TunelsController = void 0;
const common_1 = require("@nestjs/common");
const tunels_service_1 = require("./tunels.service");
const update_tunel_dto_1 = require("./dto/update-tunel.dto");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/jwt-auth/jwt-auth.guard");
let TunelsController = class TunelsController {
    constructor(tunelsService) {
        this.tunelsService = tunelsService;
    }
    create(user) {
        return this.tunelsService.create(user);
    }
    findAll() {
        return this.tunelsService.findAll();
    }
    findOne(id) {
        return this.tunelsService.findOne(id);
    }
    update(id, userupadte) {
        console.log(id, userupadte);
        return this.tunelsService.update(id, userupadte);
    }
    remove(id) {
        return this.tunelsService.remove(id);
    }
    config(id) {
        return this.tunelsService.getConfig(id);
    }
    updateConfig(id, updateTunelDto) {
        return this.tunelsService.updateConfig(id, updateTunelDto);
    }
    dns() {
        return this.tunelsService.getDns();
    }
    createDns(createdns) {
        return this.tunelsService.createDns(createdns);
    }
    updateDns(id, updateDns) {
        return this.tunelsService.updateDns(id, updateDns);
    }
    removeDns(id) {
        return this.tunelsService.deleteDns(id);
    }
    token(id) {
        return this.tunelsService.getToken(id);
    }
};
exports.TunelsController = TunelsController;
__decorate([
    (0, common_1.Post)('/user/:user'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('user')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TunelsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TunelsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('/info/:idtunels'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('idtunels')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TunelsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)('/updateuser/:idtunels/:userupadte'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('idtunels')),
    __param(1, (0, common_1.Param)('userupadte')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], TunelsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)('/:idtunels'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('idtunels')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TunelsController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)('/config/:idtunels'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('idtunels')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TunelsController.prototype, "config", null);
__decorate([
    (0, swagger_1.ApiBody)({ type: update_tunel_dto_1.UpdateTunelDto }),
    (0, common_1.Patch)('/config/:idtunels'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('idtunels')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], TunelsController.prototype, "updateConfig", null);
__decorate([
    (0, common_1.Get)('/dns'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TunelsController.prototype, "dns", null);
__decorate([
    (0, common_1.Post)('/dns'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TunelsController.prototype, "createDns", null);
__decorate([
    (0, common_1.Patch)('/dns/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], TunelsController.prototype, "updateDns", null);
__decorate([
    (0, common_1.Delete)('/dns/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TunelsController.prototype, "removeDns", null);
__decorate([
    (0, common_1.Get)('/token/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TunelsController.prototype, "token", null);
exports.TunelsController = TunelsController = __decorate([
    (0, swagger_1.ApiTags)('Tunels'),
    (0, common_1.Controller)('tunels'),
    __metadata("design:paramtypes", [tunels_service_1.TunelsService])
], TunelsController);
//# sourceMappingURL=tunels.controller.js.map