"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Version = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const appversions_schema_1 = require("../schemas/appversions.schema");
class Version extends swagger_1.OmitType(appversions_schema_1.AppVersion, [
    's3FileMeta',
    'contentVersionFilePath',
    'originalVersionFileName'
]) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.Version = Version;
//# sourceMappingURL=version.dto.js.map