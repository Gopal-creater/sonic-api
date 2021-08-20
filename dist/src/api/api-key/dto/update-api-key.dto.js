"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminUpdateApiKeyDto = exports.UpdateApiKeyDto = void 0;
const openapi = require("@nestjs/swagger");
const mapped_types_1 = require("@nestjs/mapped-types");
const create_api_key_dto_1 = require("./create-api-key.dto");
class UpdateApiKeyDto extends mapped_types_1.PartialType(create_api_key_dto_1.CreateApiKeyDto) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateApiKeyDto = UpdateApiKeyDto;
class AdminUpdateApiKeyDto extends mapped_types_1.PartialType(create_api_key_dto_1.AdminCreateApiKeyDto) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.AdminUpdateApiKeyDto = AdminUpdateApiKeyDto;
//# sourceMappingURL=update-api-key.dto.js.map