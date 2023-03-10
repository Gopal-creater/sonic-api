"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminUpdateApiKeyDto = exports.UpdateApiKeyDto = void 0;
const openapi = require("@nestjs/swagger");
const create_api_key_dto_1 = require("./create-api-key.dto");
const swagger_1 = require("@nestjs/swagger");
class UpdateApiKeyDto extends swagger_1.PartialType(swagger_1.OmitType(create_api_key_dto_1.CreateApiKeyDto, ['company', 'customer', 'type'])) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateApiKeyDto = UpdateApiKeyDto;
class AdminUpdateApiKeyDto extends swagger_1.PartialType(create_api_key_dto_1.AdminCreateApiKeyDto) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.AdminUpdateApiKeyDto = AdminUpdateApiKeyDto;
//# sourceMappingURL=update-api-key.dto.js.map