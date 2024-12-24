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
exports.DokerController = void 0;
const common_1 = require("@nestjs/common");
const doker_service_1 = require("./doker.service");
const update_passwordmysql_dto_1 = require("./dto/update-passwordmysql.dto");
const swagger_1 = require("@nestjs/swagger");
let DokerController = class DokerController {
    constructor(dokerService) {
        this.dokerService = dokerService;
    }
    createDoker(nombre) {
        return this.dokerService.createContainer(nombre);
    }
    startDoker(nombre) {
        return this.dokerService.startDocker(nombre);
    }
    updatePasswordmysql(updatePasswordmysqlDto) {
        return this.dokerService.updatePasswordmysql(updatePasswordmysqlDto);
    }
    updateUserpsql(UpdatePasswordmysqlDto) {
        return this.dokerService.updatePasswordpsql(UpdatePasswordmysqlDto);
    }
    stopDoker(nombre) {
        return this.dokerService.stopDocker(nombre);
    }
    extractZip(zipName, containerName) {
        console.log(zipName, containerName);
        return this.dokerService.extraerzip(zipName, containerName);
    }
    zipinstalldepencie(carpeta, containerName) {
        const decodedCarpeta = decodeURIComponent(carpeta);
        return this.dokerService.zipinstalldepencie(decodedCarpeta, containerName);
    }
    start(carpeta, containerName, comand) {
        const decodedComand = decodeURIComponent(comand);
        const decodedCarpeta = decodeURIComponent(carpeta);
        return this.dokerService.zipstart(decodedCarpeta, containerName, decodedComand);
    }
    stopZip(containerName, port) {
        return this.dokerService.stopZip(containerName, port);
    }
    deleteZip(carpeta, containerName) {
        const decodedCarpeta = decodeURIComponent(carpeta);
        return this.dokerService.deleteFolder(decodedCarpeta, containerName);
    }
    startCloudflare(containerName, token) {
        return this.dokerService.startserviceCloudflare(containerName, token);
    }
    stopCloudflare(containerName) {
        return this.dokerService.stopServiceCloudflare(containerName);
    }
    updateHtpasswd(containerName, user, password) {
        return this.dokerService.updateHtpasswd(containerName, user, password);
    }
    startShellInABox(containerName) {
        return this.dokerService.startShellInABox(containerName);
    }
    stopShellInABox(containerName) {
        return this.dokerService.stopShellInABox(containerName);
    }
};
exports.DokerController = DokerController;
__decorate([
    (0, common_1.Post)('/createcontainer/:nombre'),
    __param(0, (0, common_1.Param)('nombre')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DokerController.prototype, "createDoker", null);
__decorate([
    (0, common_1.Post)('/startcontainer/:nombre'),
    __param(0, (0, common_1.Param)('nombre')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DokerController.prototype, "startDoker", null);
__decorate([
    (0, common_1.Post)('/updatepasswordmysql'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_passwordmysql_dto_1.UpdatePasswordmysqlDto]),
    __metadata("design:returntype", void 0)
], DokerController.prototype, "updatePasswordmysql", null);
__decorate([
    (0, common_1.Post)('/updatepassworpsql'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_passwordmysql_dto_1.UpdatePasswordmysqlDto]),
    __metadata("design:returntype", void 0)
], DokerController.prototype, "updateUserpsql", null);
__decorate([
    (0, common_1.Post)('/stopcontainer/:nombre'),
    __param(0, (0, common_1.Param)('nombre')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DokerController.prototype, "stopDoker", null);
__decorate([
    (0, common_1.Post)('/extractzip/:zipName/:containerName'),
    __param(0, (0, common_1.Param)('zipName')),
    __param(1, (0, common_1.Param)('containerName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], DokerController.prototype, "extractZip", null);
__decorate([
    (0, common_1.Post)('/carpetadepencie/:carpeta/:containerName'),
    __param(0, (0, common_1.Param)('carpeta')),
    __param(1, (0, common_1.Param)('containerName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], DokerController.prototype, "zipinstalldepencie", null);
__decorate([
    (0, common_1.Post)('/startcarpeta/:carpeta/:containerName/:comand'),
    __param(0, (0, common_1.Param)('carpeta')),
    __param(1, (0, common_1.Param)('containerName')),
    __param(2, (0, common_1.Param)('comand')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], DokerController.prototype, "start", null);
__decorate([
    (0, common_1.Post)('/stopcarpeta/:containerName/:port'),
    __param(0, (0, common_1.Param)('containerName')),
    __param(1, (0, common_1.Param)('port')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", void 0)
], DokerController.prototype, "stopZip", null);
__decorate([
    (0, common_1.Delete)('/deletecarpeta/:carpeta/:containerName'),
    __param(0, (0, common_1.Param)('carpeta')),
    __param(1, (0, common_1.Param)('containerName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], DokerController.prototype, "deleteZip", null);
__decorate([
    (0, common_1.Post)('/startcloudflare/:containerName/:token'),
    __param(0, (0, common_1.Param)('containerName')),
    __param(1, (0, common_1.Param)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], DokerController.prototype, "startCloudflare", null);
__decorate([
    (0, common_1.Post)('/stopcloudflare/:containerName'),
    __param(0, (0, common_1.Param)('containerName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DokerController.prototype, "stopCloudflare", null);
__decorate([
    (0, common_1.Patch)('/updateHtpasswd/:containerName/:user/:password'),
    __param(0, (0, common_1.Param)('containerName')),
    __param(1, (0, common_1.Param)('user')),
    __param(2, (0, common_1.Param)('password')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], DokerController.prototype, "updateHtpasswd", null);
__decorate([
    (0, common_1.Post)('/startShellInABox/:containerName'),
    __param(0, (0, common_1.Param)('containerName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DokerController.prototype, "startShellInABox", null);
__decorate([
    (0, common_1.Post)('/stopShellInABox/:containerName'),
    __param(0, (0, common_1.Param)('containerName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DokerController.prototype, "stopShellInABox", null);
exports.DokerController = DokerController = __decorate([
    (0, swagger_1.ApiTags)('Doker'),
    (0, common_1.Controller)('doker'),
    __metadata("design:paramtypes", [doker_service_1.DokerService])
], DokerController);
//# sourceMappingURL=doker.controller.js.map