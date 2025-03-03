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
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const app_service_1 = require("./app.service");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
let AppController = class AppController {
    constructor(appService, httpService) {
        this.appService = appService;
        this.httpService = httpService;
    }
    getHello() {
        return this.appService.getHello();
    }
    async getHello2(res) {
        const data = [
            { nombre: "Juan", edad: 25 },
            { nombre: "Maria", edad: 30 },
            { nombre: "Pedro", edad: 35 }
        ];
        const nombre = "Juan";
        const apellido = "Perez";
        const postData = {
            clave: "luis",
            mensaje: "La feeeee"
        };
        try {
            const cifrado = await (0, rxjs_1.firstValueFrom)(this.httpService.post('http://localhost:3000/cifrar', postData));
            console.log(cifrado.data);
            res.render('home', {
                title: 'Mi página',
                message: 'Hola desde NestJS!',
                datos: data,
                nombre: nombre,
                apellido,
                cifrado: cifrado.data,
            });
        }
        catch (error) {
            console.error('Error al cifrar:', error);
            res.render('index', {
                title: 'Error',
                message: 'Hubo un problema al cifrar el mensaje.',
            });
        }
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], AppController.prototype, "getHello", null);
__decorate([
    (0, common_1.Get)("/hello"),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getHello2", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [app_service_1.AppService, axios_1.HttpService])
], AppController);
//# sourceMappingURL=app.controller.js.map