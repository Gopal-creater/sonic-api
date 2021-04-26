"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateThirdpartyDetectionDto = void 0;
const openapi = require("@nestjs/swagger");
const thirdparty_detection_schema_1 = require("../schemas/thirdparty-detection.schema");
class CreateThirdpartyDetectionDto extends thirdparty_detection_schema_1.ThirdpartyDetection {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.CreateThirdpartyDetectionDto = CreateThirdpartyDetectionDto;
//# sourceMappingURL=create-thirdparty-detection.dto.js.map