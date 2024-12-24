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
exports.RaresService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const zip_project_entity_1 = require("../zip_projects/entities/zip_project.entity");
const typeorm_2 = require("typeorm");
const usuario_entity_1 = require("../usuarios/entities/usuario.entity");
const tunels_service_1 = require("../tunels/tunels.service");
let RaresService = class RaresService {
    constructor(zipProjectRepository, usuarioRepository, tunelsService) {
        this.zipProjectRepository = zipProjectRepository;
        this.usuarioRepository = usuarioRepository;
        this.tunelsService = tunelsService;
    }
    async create(createRareDto, rarname) {
        const user = await this.usuarioRepository.findOneBy({
            usuario: createRareDto.usuario
        });
        if (!user) {
            return new common_1.HttpException('Usuario no encontrado', common_1.HttpStatus.NOT_FOUND);
        }
        const nuevoProyecto = await this.zipProjectRepository.create({
            zip: rarname,
            usuario: user
        });
        await this.zipProjectRepository.save(nuevoProyecto);
        return nuevoProyecto;
    }
    findAll() {
        return `This action returns all rares`;
    }
    findOne(id) {
        return `This action returns a #${id} rare`;
    }
    update(id, updateRareDto) {
        return `This action updates a #${id} rare`;
    }
    remove(id) {
        return `This action removes a #${id} rare`;
    }
};
exports.RaresService = RaresService;
exports.RaresService = RaresService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(zip_project_entity_1.ZipProject)),
    __param(1, (0, typeorm_1.InjectRepository)(usuario_entity_1.Usuario)),
    __metadata("design:paramtypes", [typeorm_2.Repository, typeorm_2.Repository, tunels_service_1.TunelsService])
], RaresService);
//# sourceMappingURL=rares.service.js.map