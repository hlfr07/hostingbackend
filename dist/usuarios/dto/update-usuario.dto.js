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
exports.UpdateUsuarioDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class UpdateUsuarioDto {
}
exports.UpdateUsuarioDto = UpdateUsuarioDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_transformer_1.Transform)(({ value }) => typeof value === 'string' ? value.trim() : value),
    (0, class_validator_1.IsNotEmpty)({ message: 'El nombre de usuario no puede estar vacío' }),
    (0, class_validator_1.IsString)({ message: 'El nombre de usuario debe ser un texto' }),
    (0, class_validator_1.MaxLength)(50, { message: 'El nombre de usuario debe tener menos de 50 caracteres' }),
    (0, class_validator_1.MinLength)(3, { message: 'El nombre de usuario debe tener más de 3 caracteres' }),
    __metadata("design:type", String)
], UpdateUsuarioDto.prototype, "nombre", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_transformer_1.Transform)(({ value }) => typeof value === 'string' ? value.trim() : value),
    (0, class_validator_1.IsNotEmpty)({ message: 'El email de usuario no puede estar vacío' }),
    (0, class_validator_1.IsString)({ message: 'El email de usuario debe ser un texto' }),
    (0, class_validator_1.MaxLength)(50, { message: 'El email de usuario debe tener menos de 50 caracteres' }),
    (0, class_validator_1.MinLength)(3, { message: 'El email de usuario debe tener más de 3 caracteres' }),
    __metadata("design:type", String)
], UpdateUsuarioDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_transformer_1.Transform)(({ value }) => typeof value === 'string' ? value.trim() : value),
    (0, class_validator_1.IsNotEmpty)({ message: 'El perfil de usuario no puede estar vacío' }),
    (0, class_validator_1.IsString)({ message: 'El perfil de usuario debe ser un texto' }),
    (0, class_validator_1.MaxLength)(100, { message: 'El perfil de usuario debe tener menos de 100 caracteres' }),
    (0, class_validator_1.MinLength)(1, { message: 'El perfil de usuario debe tener más de 1 caracteres' }),
    __metadata("design:type", String)
], UpdateUsuarioDto.prototype, "id_perfil", void 0);
//# sourceMappingURL=update-usuario.dto.js.map