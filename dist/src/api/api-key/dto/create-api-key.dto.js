"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminCreateApiKeyDto = exports.CreateApiKeyDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const Enums_1 = require("../../../constants/Enums");
class CreateApiKeyDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { customer: { required: true, type: () => String }, groups: { required: true }, company: { required: true, type: () => String }, validity: { required: false, type: () => Date }, disabled: { required: false, type: () => Boolean }, type: { required: false, type: () => String }, suspended: { required: false, type: () => Boolean }, revoked: { required: false, type: () => Boolean }, metaData: { required: false } };
    }
}
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], CreateApiKeyDto.prototype, "customer", void 0);
__decorate([
    swagger_1.ApiProperty({ type: String, isArray: true }),
    __metadata("design:type", Array)
], CreateApiKeyDto.prototype, "groups", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], CreateApiKeyDto.prototype, "company", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Date)
], CreateApiKeyDto.prototype, "validity", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Boolean)
], CreateApiKeyDto.prototype, "disabled", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], CreateApiKeyDto.prototype, "type", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Boolean)
], CreateApiKeyDto.prototype, "suspended", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Boolean)
], CreateApiKeyDto.prototype, "revoked", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Map)
], CreateApiKeyDto.prototype, "metaData", void 0);
exports.CreateApiKeyDto = CreateApiKeyDto;
class AdminCreateApiKeyDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { customer: { required: true, type: () => String }, groups: { required: true }, company: { required: true, type: () => String }, validity: { required: false, type: () => Date }, disabled: { required: false, type: () => Boolean }, type: { required: false, type: () => String }, suspended: { required: false, type: () => Boolean }, revoked: { required: false, type: () => Boolean }, metaData: { required: false } };
    }
}
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], AdminCreateApiKeyDto.prototype, "customer", void 0);
__decorate([
    swagger_1.ApiProperty({ type: String, isArray: true }),
    __metadata("design:type", Array)
], AdminCreateApiKeyDto.prototype, "groups", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], AdminCreateApiKeyDto.prototype, "company", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Date)
], AdminCreateApiKeyDto.prototype, "validity", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Boolean)
], AdminCreateApiKeyDto.prototype, "disabled", void 0);
__decorate([
    swagger_1.ApiProperty({ enum: Enums_1.ApiKeyType }),
    __metadata("design:type", String)
], AdminCreateApiKeyDto.prototype, "type", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Boolean)
], AdminCreateApiKeyDto.prototype, "suspended", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Boolean)
], AdminCreateApiKeyDto.prototype, "revoked", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Map)
], AdminCreateApiKeyDto.prototype, "metaData", void 0);
exports.AdminCreateApiKeyDto = AdminCreateApiKeyDto;
//# sourceMappingURL=create-api-key.dto.js.map