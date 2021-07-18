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
exports.CreateLicensekeyDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
class CreateLicensekeyDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: true, type: () => String }, disabled: { required: false, type: () => Boolean }, suspended: { required: false, type: () => Boolean }, maxEncodeUses: { required: true, type: () => Number }, encodeUses: { required: true, type: () => Number }, maxDecodeUses: { required: true, type: () => Number }, decodeUses: { required: true, type: () => Number }, validity: { required: true, type: () => Date }, metaData: { required: false } };
    }
}
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], CreateLicensekeyDto.prototype, "name", void 0);
__decorate([
    swagger_1.ApiProperty({ default: false }),
    __metadata("design:type", Boolean)
], CreateLicensekeyDto.prototype, "disabled", void 0);
__decorate([
    swagger_1.ApiProperty({ default: false }),
    __metadata("design:type", Boolean)
], CreateLicensekeyDto.prototype, "suspended", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Number)
], CreateLicensekeyDto.prototype, "maxEncodeUses", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Number)
], CreateLicensekeyDto.prototype, "encodeUses", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Number)
], CreateLicensekeyDto.prototype, "maxDecodeUses", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Number)
], CreateLicensekeyDto.prototype, "decodeUses", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Date)
], CreateLicensekeyDto.prototype, "validity", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Map)
], CreateLicensekeyDto.prototype, "metaData", void 0);
exports.CreateLicensekeyDto = CreateLicensekeyDto;
//# sourceMappingURL=create-licensekey.dto.js.map