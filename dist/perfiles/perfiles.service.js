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
exports.PerfilesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const perfile_entity_1 = require("./entities/perfile.entity");
const typeorm_2 = require("typeorm");
let PerfilesService = class PerfilesService {
    constructor(perfileRepository) {
        this.perfileRepository = perfileRepository;
    }
    async create(createPerfileDto) {
        const perfileEncontrado = await this.perfileRepository.findOneBy({
            perfil: createPerfileDto.perfil
        });
        if (perfileEncontrado) {
            throw new common_1.HttpException('El perfil ya existe', common_1.HttpStatus.CONFLICT);
        }
        const nuevoPerfil = this.perfileRepository.create({
            perfil: createPerfileDto.perfil,
        });
        await this.perfileRepository.save(nuevoPerfil);
        return nuevoPerfil;
    }
    findAll() {
        const perfiles = this.perfileRepository.find({
            order: { id: 'DESC' }
        });
        return perfiles;
    }
    async findOne(id) {
        const perfilEncontrado = await this.perfileRepository.findOneBy({
            id: id,
            estado: true
        });
        if (!perfilEncontrado) {
            throw new common_1.HttpException('Perfil no encontrado', common_1.HttpStatus.NOT_FOUND);
        }
        if (!perfilEncontrado.estado) {
            throw new common_1.HttpException('Perfil no encontrado', common_1.HttpStatus.NOT_FOUND);
        }
        return perfilEncontrado;
    }
    async update(id, updatePerfileDto) {
        const perfilEncontrado = await this.perfileRepository.findOneBy({
            id: id,
        });
        if (!perfilEncontrado) {
            throw new common_1.HttpException('Perfil no encontrado', common_1.HttpStatus.NOT_FOUND);
        }
        if (updatePerfileDto.perfil !== perfilEncontrado.perfil) {
            const perfileEncontrado = await this.perfileRepository.findOneBy({
                perfil: updatePerfileDto.perfil
            });
            if (perfileEncontrado) {
                throw new common_1.HttpException('El perfil ya existe', common_1.HttpStatus.CONFLICT);
            }
        }
        perfilEncontrado.perfil = updatePerfileDto.perfil;
        await this.perfileRepository.update(id, perfilEncontrado);
        return { message: 'Perfil actualizado correctamente' };
    }
    async remove(id) {
        const perfilEncontrado = await this.perfileRepository.findOneBy({
            id: id,
            estado: true
        });
        if (!perfilEncontrado) {
            throw new common_1.HttpException('Perfil no encontrado', common_1.HttpStatus.NOT_FOUND);
        }
        if (!perfilEncontrado.estado) {
            throw new common_1.HttpException('Perfil eliminado', common_1.HttpStatus.NOT_FOUND);
        }
        await this.perfileRepository.update(id, { estado: false });
        return { message: 'Perfil eliminado correctamente' };
    }
};
exports.PerfilesService = PerfilesService;
exports.PerfilesService = PerfilesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(perfile_entity_1.Perfile)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], PerfilesService);
//# sourceMappingURL=perfiles.service.js.map