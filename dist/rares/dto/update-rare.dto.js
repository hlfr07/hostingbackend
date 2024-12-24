"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateRareDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_rare_dto_1 = require("./create-rare.dto");
class UpdateRareDto extends (0, swagger_1.PartialType)(create_rare_dto_1.CreateRareDto) {
}
exports.UpdateRareDto = UpdateRareDto;
//# sourceMappingURL=update-rare.dto.js.map