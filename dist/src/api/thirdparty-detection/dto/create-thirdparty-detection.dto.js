"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateThirdpartyDetectionDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const thirdparty_detection_schema_1 = require("../schemas/thirdparty-detection.schema");
class CreateThirdpartyDetectionDto extends swagger_1.OmitType(thirdparty_detection_schema_1.ThirdpartyDetection, ['id', 'customer']) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.CreateThirdpartyDetectionDto = CreateThirdpartyDetectionDto;
//# sourceMappingURL=create-thirdparty-detection.dto.js.map