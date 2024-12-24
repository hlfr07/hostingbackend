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
exports.ComandsController = void 0;
const common_1 = require("@nestjs/common");
const comands_service_1 = require("./comands.service");
let ComandsController = class ComandsController {
    constructor(comandsService) {
        this.comandsService = comandsService;
    }
};
exports.ComandsController = ComandsController;
exports.ComandsController = ComandsController = __decorate([
    (0, common_1.Controller)('comands'),
    __metadata("design:paramtypes", [comands_service_1.ComandsService])
], ComandsController);
//# sourceMappingURL=comands.controller.js.map