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
exports.CreatePartnerDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const company_schema_1 = require("../../company/schemas/company.schema");
const constant_1 = require("../constant");
class CreatePartnerDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: true, type: () => String }, description: { required: true, type: () => String }, partnerType: { required: true, type: () => String }, email: { required: true, type: () => String }, contactNo: { required: true, type: () => String }, address: { required: true, type: () => require("../../company/schemas/company.schema").Address }, owner: { required: true, type: () => String }, enabled: { required: true, type: () => Boolean } };
    }
}
__decorate([
    class_validator_1.IsNotEmpty(),
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], CreatePartnerDto.prototype, "name", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], CreatePartnerDto.prototype, "description", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsIn(constant_1.partnerTypes),
    __metadata("design:type", String)
], CreatePartnerDto.prototype, "partnerType", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], CreatePartnerDto.prototype, "email", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], CreatePartnerDto.prototype, "contactNo", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", company_schema_1.Address)
], CreatePartnerDto.prototype, "address", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], CreatePartnerDto.prototype, "owner", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Boolean)
], CreatePartnerDto.prototype, "enabled", void 0);
exports.CreatePartnerDto = CreatePartnerDto;
//# sourceMappingURL=create-partner.dto.js.map