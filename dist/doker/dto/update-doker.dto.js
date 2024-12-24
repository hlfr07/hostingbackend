"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateDokerDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_doker_dto_1 = require("./create-doker.dto");
class UpdateDokerDto extends (0, swagger_1.PartialType)(create_doker_dto_1.CreateDokerDto) {
}
exports.UpdateDokerDto = UpdateDokerDto;
//# sourceMappingURL=update-doker.dto.js.map