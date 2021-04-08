"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateRadiostationDto = void 0;
const openapi = require("@nestjs/swagger");
const mapped_types_1 = require("@nestjs/mapped-types");
const create_radiostation_dto_1 = require("./create-radiostation.dto");
class UpdateRadiostationDto extends mapped_types_1.PartialType(create_radiostation_dto_1.CreateRadiostationDto) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateRadiostationDto = UpdateRadiostationDto;
//# sourceMappingURL=update-radiostation.dto.js.map