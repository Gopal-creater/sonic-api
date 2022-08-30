"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateGroupDto = void 0;
const openapi = require("@nestjs/swagger");
const mapped_types_1 = require("@nestjs/mapped-types");
const create_group_dto_1 = require("./create-group.dto");
class UpdateGroupDto extends (0, mapped_types_1.PartialType)(create_group_dto_1.CreateGroupDto) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateGroupDto = UpdateGroupDto;
//# sourceMappingURL=update-group.dto.js.map