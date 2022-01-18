"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateDetectionDto = void 0;
const openapi = require("@nestjs/swagger");
const mapped_types_1 = require("@nestjs/mapped-types");
const create_detection_dto_1 = require("./create-detection.dto");
class UpdateDetectionDto extends mapped_types_1.PartialType(create_detection_dto_1.CreateDetectionDto) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateDetectionDto = UpdateDetectionDto;
//# sourceMappingURL=update-detection.dto.js.map