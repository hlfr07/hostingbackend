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
exports.ProjectHotsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const project_hot_entity_1 = require("./entities/project_hot.entity");
const typeorm_2 = require("typeorm");
const zip_project_entity_1 = require("../zip_projects/entities/zip_project.entity");
const doker_service_1 = require("../doker/doker.service");
const tunels_service_1 = require("../tunels/tunels.service");
const axios_1 = require("axios");
let ProjectHotsService = class ProjectHotsService {
    constructor(projecthotRepository, zipprojectRepository, dokerService, serviceTunnel) {
        this.projecthotRepository = projecthotRepository;
        this.zipprojectRepository = zipprojectRepository;
        this.dokerService = dokerService;
        this.serviceTunnel = serviceTunnel;
    }
    async create(createProjectHotDto) {
        const projecthotExist = await this.zipprojectRepository.findOneBy({
            id: parseInt(createProjectHotDto.zip_id)
        });
        if (!projecthotExist) {
            throw new common_1.HttpException('El id de zip_project no existe', common_1.HttpStatus.NOT_FOUND);
        }
        if (isNaN(parseInt(createProjectHotDto.port))) {
            throw new common_1.HttpException('El port debe ser un número', common_1.HttpStatus.BAD_REQUEST);
        }
        const urlPattern = new RegExp(`^.+_${projecthotExist.usuario.usuario}\\.theinnovatesoft\\.xyz$`);
        if (!urlPattern.test(createProjectHotDto.url)) {
            throw new common_1.HttpException(`La URL debe contener el formato "{loqueguste}_${projecthotExist.usuario.usuario}.theinnovatesoft.xyz"`, common_1.HttpStatus.BAD_REQUEST);
        }
        const extraerzip = await this.dokerService.extraerzip(projecthotExist.zip, projecthotExist.usuario.usuario);
        console.log(extraerzip);
        const tunel = await this.serviceTunnel.getConfig(projecthotExist.usuario.id_tunel);
        const newIngress = {
            service: `http://localhost:${createProjectHotDto.port}`,
            hostname: createProjectHotDto.url,
            originRequest: {},
        };
        const ingress = tunel.config.ingress;
        const index404 = ingress.findIndex((item) => item.service === "http_status:404");
        if (index404 !== -1) {
            ingress.splice(index404, 0, newIngress);
        }
        else {
            ingress.push(newIngress);
        }
        tunel.config.ingress = ingress;
        const tunelConfig = {
            config: tunel.config,
        };
        await this.serviceTunnel.updateConfig(projecthotExist.usuario.id_tunel, tunelConfig);
        const newProjectHot = this.projecthotRepository.create({
            zipProject: projecthotExist,
            namecarpeta: extraerzip,
            url: createProjectHotDto.url,
            port: parseInt(createProjectHotDto.port)
        });
        await this.projecthotRepository.save(newProjectHot);
        return newProjectHot;
    }
    findAll() {
        const project_hots = this.projecthotRepository.find({
            order: { id: 'DESC' }
        });
        return project_hots;
    }
    async findOne(id) {
        const projectHotExist = await this.projecthotRepository.findOneBy({
            id: id
        });
        if (!projectHotExist) {
            throw new common_1.HttpException('ProjectHot no encontrado', common_1.HttpStatus.NOT_FOUND);
        }
        return projectHotExist;
    }
    async findOneByUser(id, page, limit) {
        const skip = (page - 1) * limit;
        const [projectHotExist, totalCount] = await this.projecthotRepository.findAndCount({
            where: {
                zipProject: {
                    usuario: {
                        id: id,
                    },
                },
                estado: true,
            },
            take: limit,
            skip: skip,
        });
        if (!projectHotExist || projectHotExist.length === 0) {
            throw new common_1.HttpException('ProjectHot no encontrado', common_1.HttpStatus.NOT_FOUND);
        }
        for (const project of projectHotExist) {
            const url = project.url;
            const urlCompleta = `https://${url}`;
            try {
                const response = await axios_1.default.get(urlCompleta, { timeout: 5000 });
                if (response.status >= 200 && response.status < 400) {
                    project.webstatus = true;
                }
                else {
                    project.webstatus = false;
                }
            }
            catch (error) {
                project.webstatus = false;
            }
        }
        return {
            data: projectHotExist,
            total: totalCount,
            currentPage: page,
            totalPages: 12,
        };
    }
    async findOneByZipProject(id) {
        console.log("entro");
        const projectHotExist = await this.projecthotRepository.find({
            where: {
                zipProject: {
                    id: id,
                },
            },
        });
        if (!projectHotExist || projectHotExist.length === 0) {
            throw new common_1.HttpException('ProjectHot no encontrado', common_1.HttpStatus.NOT_FOUND);
        }
        for (const project of projectHotExist) {
            const url = project.url;
            const urlCompleta = `https://${url}`;
            try {
                const response = await axios_1.default.get(urlCompleta, { timeout: 5000 });
                if (response.status >= 200 && response.status < 400) {
                    project.webstatus = true;
                }
                else {
                    project.webstatus = false;
                }
            }
            catch (error) {
                project.webstatus = false;
            }
        }
        console.log("ua esta");
        return projectHotExist;
    }
    async update(id, updateProjectHotDto) {
        return `This action updates a #${id} projectHot`;
    }
    async remove(id) {
        const projectHotExist = await this.projecthotRepository.findOneBy({
            id: id
        });
        if (!projectHotExist) {
            throw new common_1.HttpException('ProjectHot no encontrado', common_1.HttpStatus.NOT_FOUND);
        }
        if (!projectHotExist.estado) {
            throw new common_1.HttpException('ProjectHot no encontrado', common_1.HttpStatus.NOT_FOUND);
        }
        await this.dokerService.deleteFolder(projectHotExist.namecarpeta, projectHotExist.zipProject.usuario.usuario);
        const tunel = await this.serviceTunnel.getConfig(projectHotExist.zipProject.usuario.id_tunel);
        const ingress = tunel.config.ingress;
        const index = ingress.findIndex((item) => item.hostname === projectHotExist.url);
        if (index !== -1) {
            ingress.splice(index, 1);
        }
        tunel.config.ingress = ingress;
        const tunelConfig = {
            config: tunel.config,
        };
        console.log(tunelConfig.config.ingress);
        await this.serviceTunnel.updateConfig(projectHotExist.zipProject.usuario.id_tunel, tunelConfig);
        await this.projecthotRepository.update(id, { estado: false });
        return { message: 'ProjectHot eliminado correctamente' };
    }
};
exports.ProjectHotsService = ProjectHotsService;
exports.ProjectHotsService = ProjectHotsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(project_hot_entity_1.ProjectHot)),
    __param(1, (0, typeorm_1.InjectRepository)(zip_project_entity_1.ZipProject)),
    __metadata("design:paramtypes", [typeorm_2.Repository, typeorm_2.Repository, doker_service_1.DokerService, tunels_service_1.TunelsService])
], ProjectHotsService);
//# sourceMappingURL=project_hots.service.js.map