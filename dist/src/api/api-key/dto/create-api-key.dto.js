"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminCreateApiKeyDto = exports.CreateApiKeyDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const api_key_schema_1 = require("../schemas/api-key.schema");
class CreateApiKeyDto extends swagger_1.OmitType(api_key_schema_1.ApiKey, [
    'disabled',
    'customer',
    'suspended',
    'validity',
    'groups',
    'type'
]) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.CreateApiKeyDto = CreateApiKeyDto;
class AdminCreateApiKeyDto extends swagger_1.OmitType(api_key_schema_1.ApiKey, []) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.AdminCreateApiKeyDto = AdminCreateApiKeyDto;
//# sourceMappingURL=create-api-key.dto.js.map