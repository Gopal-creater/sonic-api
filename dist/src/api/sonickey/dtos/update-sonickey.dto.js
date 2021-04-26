"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateSonicKeyDto = void 0;
const openapi = require("@nestjs/swagger");
const sonicKey_dto_1 = require("./sonicKey.dto");
const swagger_1 = require("@nestjs/swagger");
class UpdateSonicKeyDto extends swagger_1.PartialType(swagger_1.OmitType(sonicKey_dto_1.SonicKeyDto, [
    'encodingStrength',
    'contentType',
    'contentDuration',
    'contentCreatedDate',
    'contentEncoding',
    'contentFileName',
    'contentFilePath',
    'contentFileType',
    'contentSamplingFrequency',
    'contentSize',
])) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateSonicKeyDto = UpdateSonicKeyDto;
//# sourceMappingURL=update-sonickey.dto.js.map