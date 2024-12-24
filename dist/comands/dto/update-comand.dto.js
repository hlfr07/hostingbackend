"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateComandDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_comand_dto_1 = require("./create-comand.dto");
class UpdateComandDto extends (0, swagger_1.PartialType)(create_comand_dto_1.CreateComandDto) {
}
exports.UpdateComandDto = UpdateComandDto;
//# sourceMappingURL=update-comand.dto.js.map