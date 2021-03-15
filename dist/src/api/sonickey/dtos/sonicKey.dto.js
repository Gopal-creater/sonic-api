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
exports.SonicKeyDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
class SonicKeyDto {
    constructor() {
        this.encodingStrength = 10;
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { encodingStrength: { required: false, type: () => Number, default: 10 }, contentType: { required: false, type: () => String }, contentDescription: { required: false, type: () => String }, contentCreatedDate: { required: false, type: () => Date }, contentDuration: { required: false, type: () => Number }, contentSize: { required: false, type: () => Number }, contentFilePath: { required: false, type: () => String }, contentFileType: { required: false, type: () => String }, contentEncoding: { required: false, type: () => String }, contentSamplingFrequency: { required: false, type: () => String }, isrcCode: { required: false, type: () => String }, iswcCode: { required: false, type: () => String }, tuneCode: { required: false, type: () => String }, contentName: { required: false, type: () => String }, contentOwner: { required: false, type: () => String }, contentValidation: { required: false, type: () => Boolean }, contentFileName: { required: false, type: () => String }, contentQuality: { required: false, type: () => String } };
    }
}
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Number)
], SonicKeyDto.prototype, "encodingStrength", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], SonicKeyDto.prototype, "contentType", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], SonicKeyDto.prototype, "contentDescription", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Date)
], SonicKeyDto.prototype, "contentCreatedDate", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Number)
], SonicKeyDto.prototype, "contentDuration", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Number)
], SonicKeyDto.prototype, "contentSize", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], SonicKeyDto.prototype, "contentFilePath", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], SonicKeyDto.prototype, "contentFileType", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], SonicKeyDto.prototype, "contentEncoding", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], SonicKeyDto.prototype, "contentSamplingFrequency", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], SonicKeyDto.prototype, "isrcCode", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], SonicKeyDto.prototype, "iswcCode", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], SonicKeyDto.prototype, "tuneCode", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], SonicKeyDto.prototype, "contentName", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], SonicKeyDto.prototype, "contentOwner", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Boolean)
], SonicKeyDto.prototype, "contentValidation", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], SonicKeyDto.prototype, "contentFileName", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], SonicKeyDto.prototype, "contentQuality", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Object)
], SonicKeyDto.prototype, "additionalMetadata", void 0);
exports.SonicKeyDto = SonicKeyDto;
//# sourceMappingURL=sonicKey.dto.js.map