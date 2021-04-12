"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateRadiostationSonicKeyDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const radiostation_sonickey_schema_1 = require("../../../../schemas/radiostation-sonickey.schema");
class CreateRadiostationSonicKeyDto extends swagger_1.OmitType(radiostation_sonickey_schema_1.RadioStationSonicKey, [
    'count'
]) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.CreateRadiostationSonicKeyDto = CreateRadiostationSonicKeyDto;
//# sourceMappingURL=create-radiostation-sonickey.dto.js.map