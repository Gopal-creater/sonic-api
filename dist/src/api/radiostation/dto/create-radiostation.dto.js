"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateRadiostationDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const radiostation_schema_1 = require("../schemas/radiostation.schema");
class CreateRadiostationDto extends swagger_1.OmitType(radiostation_schema_1.RadioStation, [
    'startedAt',
    'stopAt',
    'isStreamStarted',
    'error',
    'isError'
]) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.CreateRadiostationDto = CreateRadiostationDto;
//# sourceMappingURL=create-radiostation.dto.js.map