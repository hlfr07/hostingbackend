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
exports.RaresController = void 0;
const common_1 = require("@nestjs/common");
const rares_service_1 = require("./rares.service");
const create_rare_dto_1 = require("./dto/create-rare.dto");
const platform_express_1 = require("@nestjs/platform-express");
const multer = require("multer");
const swagger_1 = require("@nestjs/swagger");
const Docker = require("dockerode");
let RaresController = class RaresController {
    constructor(raresService) {
        this.raresService = raresService;
        this.docker = new Docker();
    }
    async create(file, createRareDto) {
        const { usuario } = createRareDto;
        try {
            const container = this.docker.getContainer(usuario);
            const containerInfo = await container.inspect();
            if (!containerInfo.State.Running) {
                throw new Error(`El contenedor ${usuario} no está en ejecución.`);
            }
            const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
            const sanitizedOriginalName = file.originalname.replace(/\s/g, '-').replace(/[^a-zA-Z0-9.-]/g, '');
            const filename = `${uniqueSuffix}-${sanitizedOriginalName}`;
            const containerPath = `/uploads/${filename}`;
            const mkdirCmd = ['mkdir', '-p', '/uploads'];
            const mkdirExec = await container.exec({
                Cmd: mkdirCmd,
                AttachStdout: true,
                AttachStderr: true,
            });
            await mkdirExec.start();
            const tarStream = this.createTarStream(file.buffer, filename);
            await container.putArchive(tarStream, {
                path: '/uploads',
            });
            return this.raresService.create(createRareDto, containerPath);
        }
        catch (error) {
            throw new Error(`Error al cargar el archivo al contenedor del usuario ${usuario}: ${error.message}`);
        }
    }
    createTarStream(fileBuffer, filename) {
        const tar = require('tar-stream');
        const pack = tar.pack();
        pack.entry({ name: filename }, fileBuffer, (err) => {
            if (err)
                throw err;
            pack.finalize();
        });
        return pack;
    }
};
exports.RaresController = RaresController;
__decorate([
    (0, swagger_1.ApiBody)({ type: create_rare_dto_1.CreateRareDto }),
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: multer.memoryStorage(),
        fileFilter: (req, file, cb) => {
            if (file.mimetype === 'application/zip' || file.originalname.endsWith('.zip')) {
                cb(null, true);
            }
            else {
                cb(new Error('Solo se permiten archivos ZIP.'), false);
            }
        },
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_rare_dto_1.CreateRareDto]),
    __metadata("design:returntype", Promise)
], RaresController.prototype, "create", null);
exports.RaresController = RaresController = __decorate([
    (0, common_1.Controller)('rares'),
    __metadata("design:paramtypes", [rares_service_1.RaresService])
], RaresController);
//# sourceMappingURL=rares.controller.js.map