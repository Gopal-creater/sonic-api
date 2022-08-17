"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateThirdpartyDetectionDto = void 0;
const openapi = require("@nestjs/swagger");
const mapped_types_1 = require("@nestjs/mapped-types");
const create_thirdparty_detection_dto_1 = require("./create-thirdparty-detection.dto");
class UpdateThirdpartyDetectionDto extends (0, mapped_types_1.PartialType)(create_thirdparty_detection_dto_1.CreateThirdpartyDetectionDto) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateThirdpartyDetectionDto = UpdateThirdpartyDetectionDto;
//# sourceMappingURL=update-thirdparty-detection.dto.js.map