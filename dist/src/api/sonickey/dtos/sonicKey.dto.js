"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SonicKeyDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const sonickey_schema_1 = require("../schemas/sonickey.schema");
class SonicKeyDto extends swagger_1.OmitType(sonickey_schema_1.SonicKey, [
    'sonicKey',
    'owner',
    'job',
    'channel',
    'originalFileName',
    'contentFilePath',
    'apiKey',
    'license',
    'status',
    's3FileMeta',
    's3OriginalFileMeta',
    'groups'
]) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.SonicKeyDto = SonicKeyDto;
//# sourceMappingURL=sonicKey.dto.js.map