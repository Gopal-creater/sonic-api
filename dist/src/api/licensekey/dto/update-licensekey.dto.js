"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateLicensekeyDto = void 0;
const openapi = require("@nestjs/swagger");
const mapped_types_1 = require("@nestjs/mapped-types");
const create_licensekey_dto_1 = require("./create-licensekey.dto");
class UpdateLicensekeyDto extends mapped_types_1.PartialType(create_licensekey_dto_1.CreateLicensekeyDto) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateLicensekeyDto = UpdateLicensekeyDto;
//# sourceMappingURL=update-licensekey.dto.js.map