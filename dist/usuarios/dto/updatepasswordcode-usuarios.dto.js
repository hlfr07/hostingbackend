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
exports.UpdatePasswordCodeUsuarioDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class UpdatePasswordCodeUsuarioDto {
}
exports.UpdatePasswordCodeUsuarioDto = UpdatePasswordCodeUsuarioDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_transformer_1.Transform)(({ value }) => typeof value === 'string' ? value.trim() : value),
    (0, class_validator_1.IsNotEmpty)({ message: 'La contraseña no puede estar vacía' }),
    (0, class_validator_1.IsString)({ message: 'La contraseña debe ser un texto' }),
    (0, class_validator_1.MaxLength)(50, { message: 'La contraseña debe tener menos de 50 caracteres' }),
    (0, class_validator_1.MinLength)(3, { message: 'La contraseña debe tener más de 3 caracteres' }),
    __metadata("design:type", String)
], UpdatePasswordCodeUsuarioDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_transformer_1.Transform)(({ value }) => typeof value === 'string' ? value.trim() : value),
    (0, class_validator_1.IsNotEmpty)({ message: 'El código de reseteo no puede estar vacío' }),
    (0, class_validator_1.IsString)({ message: 'El código de reseteo debe ser un texto' }),
    (0, class_validator_1.MaxLength)(6, { message: 'El código de reseteo debe tener menos de 6 caracteres' }),
    (0, class_validator_1.MinLength)(6, { message: 'El código de reseteo debe tener más de 6 caracteres' }),
    __metadata("design:type", String)
], UpdatePasswordCodeUsuarioDto.prototype, "resetCode", void 0);
//# sourceMappingURL=updatepasswordcode-usuarios.dto.js.map