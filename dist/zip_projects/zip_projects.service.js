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
exports.ZipProjectsService = void 0;
const common_1 = require("@nestjs/common");
const Docker = require("dockerode");
const path = require("path");
const fs = require("fs");
const tar = require("tar");
let ZipProjectsService = class ZipProjectsService {
    constructor() {
        this.docker = new Docker();
    }
    create(createZipProjectDto) {
        return 'This action adds a new zipProject';
    }
    findAll() {
        return `This action returns all zipProjects`;
    }
    findOne(id) {
        return `This action returns a #${id} zipProject`;
    }
    update(id, updateZipProjectDto) {
        return `This action updates a #${id} zipProject`;
    }
    remove(id) {
        return `This action removes a #${id} zipProject`;
    }
    async zipProjecTDocker(nombre, containerName) {
        try {
            const localZipPath = path.join(process.cwd(), 'uploads', containerName, `${nombre}.zip`);
            if (!fs.existsSync(localZipPath)) {
                throw new Error(`El archivo ${localZipPath} no existe.`);
            }
            const tarPath = path.join(process.cwd(), 'uploads', containerName, `${nombre}.tar`);
            await tar.create({
                gzip: false,
                file: tarPath,
                cwd: path.dirname(localZipPath),
            }, [path.basename(localZipPath)]);
            const container = this.docker.getContainer(containerName);
            const containerInfo = await container.inspect();
            if (!containerInfo.State.Running) {
                throw new Error(`El contenedor ${containerName} no está en ejecución.`);
            }
            const containerDir = '/uploads';
            const mkdirExec = await container.exec({
                Cmd: ['mkdir', '-p', containerDir],
                AttachStdout: true,
                AttachStderr: true,
            });
            await mkdirExec.start();
            const tarStream = fs.createReadStream(tarPath);
            await container.putArchive(tarStream, { path: containerDir });
            fs.unlinkSync(tarPath);
            return `El archivo ${nombre} se copió correctamente al contenedor ${containerName} en ${containerDir}.`;
        }
        catch (error) {
            throw new Error(`Error al copiar el archivo ZIP: ${error.message}`);
        }
    }
};
exports.ZipProjectsService = ZipProjectsService;
exports.ZipProjectsService = ZipProjectsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], ZipProjectsService);
//# sourceMappingURL=zip_projects.service.js.map