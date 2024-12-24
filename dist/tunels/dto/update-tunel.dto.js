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
exports.UpdateTunelDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class UpdateTunelDto {
}
exports.UpdateTunelDto = UpdateTunelDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The configuration object for the tunnel',
        example: {
            ingress: [
                {
                    service: 'http://localhost:3000',
                    hostname: 'mouse.theinnovatesoft.xyz',
                    originRequest: {}
                },
                {
                    service: 'http://localhost:4000',
                    hostname: 'segundo_mouse.theinnovatesoft.xyz',
                    originRequest: {}
                },
                {
                    service: 'http_status:404'
                }
            ],
            'warp-routing': {
                enabled: false
            }
        },
    }),
    __metadata("design:type", Object)
], UpdateTunelDto.prototype, "config", void 0);
//# sourceMappingURL=update-tunel.dto.js.map