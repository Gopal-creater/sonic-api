"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateRadiostationDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const create_radiostation_dto_1 = require("./create-radiostation.dto");
class UpdateRadiostationDto extends (0, swagger_1.OmitType)((0, swagger_1.PartialType)(create_radiostation_dto_1.CreateRadiostationDto), []) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateRadiostationDto = UpdateRadiostationDto;
//# sourceMappingURL=update-radiostation.dto.js.map