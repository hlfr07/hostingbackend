"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectHotsModule = void 0;
const common_1 = require("@nestjs/common");
const project_hots_service_1 = require("./project_hots.service");
const project_hots_controller_1 = require("./project_hots.controller");
const typeorm_1 = require("@nestjs/typeorm");
const project_hot_entity_1 = require("./entities/project_hot.entity");
const zip_project_entity_1 = require("../zip_projects/entities/zip_project.entity");
const doker_module_1 = require("../doker/doker.module");
const tunels_module_1 = require("../tunels/tunels.module");
let ProjectHotsModule = class ProjectHotsModule {
};
exports.ProjectHotsModule = ProjectHotsModule;
exports.ProjectHotsModule = ProjectHotsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([project_hot_entity_1.ProjectHot, zip_project_entity_1.ZipProject]), doker_module_1.DokerModule, tunels_module_1.TunelsModule],
        controllers: [project_hots_controller_1.ProjectHotsController],
        providers: [project_hots_service_1.ProjectHotsService],
        exports: [project_hots_service_1.ProjectHotsService]
    })
], ProjectHotsModule);
//# sourceMappingURL=project_hots.module.js.map