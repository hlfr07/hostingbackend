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
exports.CreatePerfileDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class CreatePerfileDto {
}
exports.CreatePerfileDto = CreatePerfileDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_transformer_1.Transform)(({ value }) => typeof value === 'string' ? value.trim() : value),
    (0, class_validator_1.IsNotEmpty)({ message: 'El perfil no puede estar vacío' }),
    (0, class_validator_1.IsString)({ message: 'El perfil debe ser un texto' }),
    (0, class_validator_1.MaxLength)(50, { message: 'El perfil debe tener menos de 50 caracteres' }),
    (0, class_validator_1.MinLength)(3, { message: 'El perfil debe tener más de 3 caracteres' }),
    __metadata("design:type", String)
], CreatePerfileDto.prototype, "perfil", void 0);
//# sourceMappingURL=create-perfile.dto.js.map