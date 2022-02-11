"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateAppVersionDto = void 0;
const openapi = require("@nestjs/swagger");
const mapped_types_1 = require("@nestjs/mapped-types");
const version_dto_1 = require("./version.dto");
class UpdateAppVersionDto extends mapped_types_1.PartialType(version_dto_1.Version) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateAppVersionDto = UpdateAppVersionDto;
//# sourceMappingURL=update-app-versions.dto.js.map