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
exports.CreateProjectHotDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class CreateProjectHotDto {
}
exports.CreateProjectHotDto = CreateProjectHotDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_transformer_1.Transform)(({ value }) => typeof value === 'string' ? value.trim() : value),
    (0, class_validator_1.IsNotEmpty)({ message: 'El zip_id no puede estar vacío' }),
    (0, class_validator_1.IsString)({ message: 'El zip_id debe ser un texto' }),
    (0, class_validator_1.MaxLength)(100, { message: 'El zip_id debe tener menos de 100 caracteres' }),
    (0, class_validator_1.MinLength)(1, { message: 'El zip_id debe tener más de 1 caracteres' }),
    __metadata("design:type", String)
], CreateProjectHotDto.prototype, "zip_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_transformer_1.Transform)(({ value }) => typeof value === 'string' ? value.trim() : value),
    (0, class_validator_1.IsNotEmpty)({ message: 'El url no puede estar vacío' }),
    (0, class_validator_1.IsString)({ message: 'El url debe ser un texto' }),
    (0, class_validator_1.MaxLength)(100, { message: 'El url debe tener menos de 100 caracteres' }),
    (0, class_validator_1.MinLength)(1, { message: 'El url debe tener más de 1 caracteres' }),
    __metadata("design:type", String)
], CreateProjectHotDto.prototype, "url", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_transformer_1.Transform)(({ value }) => typeof value === 'string' ? value.trim() : value),
    (0, class_validator_1.IsNotEmpty)({ message: 'El port no puede estar vacío' }),
    (0, class_validator_1.IsString)({ message: 'El port debe ser un texto' }),
    (0, class_validator_1.MaxLength)(100, { message: 'El port debe tener menos de 100 caracteres' }),
    (0, class_validator_1.MinLength)(1, { message: 'El port debe tener más de 1 caracteres' }),
    __metadata("design:type", String)
], CreateProjectHotDto.prototype, "port", void 0);
//# sourceMappingURL=create-project_hot.dto.js.map