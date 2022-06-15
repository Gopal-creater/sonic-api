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
exports.EditPartnerUserDto = exports.UpdatePartnerCompanyDto = exports.CreatePartnerCompanyDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const company_schema_1 = require("../../../company/schemas/company.schema");
class CreatePartnerCompanyDto {
}
__decorate([
    class_validator_1.IsNotEmpty(),
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], CreatePartnerCompanyDto.prototype, "name", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], CreatePartnerCompanyDto.prototype, "description", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], CreatePartnerCompanyDto.prototype, "email", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], CreatePartnerCompanyDto.prototype, "contactNo", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", company_schema_1.Address)
], CreatePartnerCompanyDto.prototype, "address", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], CreatePartnerCompanyDto.prototype, "companyType", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], CreatePartnerCompanyDto.prototype, "companyUrnOrId", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], CreatePartnerCompanyDto.prototype, "owner", void 0);
exports.CreatePartnerCompanyDto = CreatePartnerCompanyDto;
class UpdatePartnerCompanyDto extends swagger_1.OmitType(swagger_1.PartialType(CreatePartnerCompanyDto), ['owner']) {
}
exports.UpdatePartnerCompanyDto = UpdatePartnerCompanyDto;
class EditPartnerUserDto {
}
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], EditPartnerUserDto.prototype, "name", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], EditPartnerUserDto.prototype, "phoneNumber", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], EditPartnerUserDto.prototype, "country", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Boolean)
], EditPartnerUserDto.prototype, "enabled", void 0);
exports.EditPartnerUserDto = EditPartnerUserDto;
//# sourceMappingURL=partner-company.js.map