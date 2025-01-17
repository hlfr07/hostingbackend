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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectHot = void 0;
const zip_project_entity_1 = require("../../zip_projects/entities/zip_project.entity");
const typeorm_1 = require("typeorm");
let ProjectHot = class ProjectHot {
};
exports.ProjectHot = ProjectHot;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ProjectHot.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => zip_project_entity_1.ZipProject, (zipProject) => zipProject.id, { eager: true }),
    (0, typeorm_1.JoinColumn)({ name: "zip_id" }),
    __metadata("design:type", zip_project_entity_1.ZipProject)
], ProjectHot.prototype, "zipProject", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], ProjectHot.prototype, "namecarpeta", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ProjectHot.prototype, "url", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], ProjectHot.prototype, "port", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], ProjectHot.prototype, "webstatus", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], ProjectHot.prototype, "estado", void 0);
exports.ProjectHot = ProjectHot = __decorate([
    (0, typeorm_1.Entity)({ name: "project_hots" })
], ProjectHot);
//# sourceMappingURL=project_hot.entity.js.map