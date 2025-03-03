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
exports.ProjectHotsController = void 0;
const common_1 = require("@nestjs/common");
const project_hots_service_1 = require("./project_hots.service");
const create_project_hot_dto_1 = require("./dto/create-project_hot.dto");
const swagger_1 = require("@nestjs/swagger");
const get_project_hot_dto_1 = require("./dto/get-project_hot.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth/jwt-auth.guard");
let ProjectHotsController = class ProjectHotsController {
    constructor(projectHotsService) {
        this.projectHotsService = projectHotsService;
    }
    create(createProjectHotDto) {
        return this.projectHotsService.create(createProjectHotDto);
    }
    findAll() {
        return this.projectHotsService.findAll();
    }
    findOne(id) {
        return this.projectHotsService.findOne(+id);
    }
    findOneByUser(id, page, limit) {
        return this.projectHotsService.findOneByUser(+id, +page, +limit);
    }
    findOneByZip(id) {
        return this.projectHotsService.findOneByZipProject(+id);
    }
    remove(id) {
        return this.projectHotsService.remove(+id);
    }
};
exports.ProjectHotsController = ProjectHotsController;
__decorate([
    (0, swagger_1.ApiBody)({ type: create_project_hot_dto_1.CreateProjectHotDto }),
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_project_hot_dto_1.CreateProjectHotDto]),
    __metadata("design:returntype", void 0)
], ProjectHotsController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiBody)({ type: [get_project_hot_dto_1.GetProjectHotDto] }),
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProjectHotsController.prototype, "findAll", null);
__decorate([
    (0, swagger_1.ApiBody)({ type: get_project_hot_dto_1.GetProjectHotDto }),
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProjectHotsController.prototype, "findOne", null);
__decorate([
    (0, swagger_1.ApiBody)({ type: get_project_hot_dto_1.GetProjectHotDto }),
    (0, common_1.Get)('user/:id/:page/:limit'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('page')),
    __param(2, (0, common_1.Param)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], ProjectHotsController.prototype, "findOneByUser", null);
__decorate([
    (0, swagger_1.ApiBody)({ type: get_project_hot_dto_1.GetProjectHotDto }),
    (0, common_1.Get)('zip/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProjectHotsController.prototype, "findOneByZip", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProjectHotsController.prototype, "remove", null);
exports.ProjectHotsController = ProjectHotsController = __decorate([
    (0, swagger_1.ApiTags)('ProjectHots'),
    (0, common_1.Controller)('project-hots'),
    __metadata("design:paramtypes", [project_hots_service_1.ProjectHotsService])
], ProjectHotsController);
//# sourceMappingURL=project_hots.controller.js.map