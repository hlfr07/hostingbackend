"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePerfileDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_perfile_dto_1 = require("./create-perfile.dto");
class UpdatePerfileDto extends (0, mapped_types_1.PartialType)(create_perfile_dto_1.CreatePerfileDto) {
}
exports.UpdatePerfileDto = UpdatePerfileDto;
//# sourceMappingURL=update-perfile.dto.js.map