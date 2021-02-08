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
exports.CreateSonicKeyDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
class CreateSonicKeyDto {
    constructor() {
        this.encodingStrength = 10;
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { owner: { required: true, type: () => String }, encodingStrength: { required: false, type: () => Number, default: 10 }, contentType: { required: false, type: () => String }, contentDescription: { required: false, type: () => String }, contentCreatedDate: { required: false, type: () => Date }, contentDuration: { required: false, type: () => Number }, contentSize: { required: false, type: () => Number }, contentFilePath: { required: false, type: () => String }, contentFileType: { required: false, type: () => String }, contentEncoding: { required: false, type: () => String }, contentSamplingFrequency: { required: false, type: () => String }, contentName: { required: false, type: () => String }, contentOwner: { required: false, type: () => String }, contentValidation: { required: false, type: () => Boolean }, contentFileName: { required: false, type: () => String }, contentQuality: { required: false, type: () => String } };
    }
}
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], CreateSonicKeyDto.prototype, "owner", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Number)
], CreateSonicKeyDto.prototype, "encodingStrength", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], CreateSonicKeyDto.prototype, "contentType", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], CreateSonicKeyDto.prototype, "contentDescription", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Date)
], CreateSonicKeyDto.prototype, "contentCreatedDate", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Number)
], CreateSonicKeyDto.prototype, "contentDuration", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Number)
], CreateSonicKeyDto.prototype, "contentSize", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], CreateSonicKeyDto.prototype, "contentFilePath", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], CreateSonicKeyDto.prototype, "contentFileType", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], CreateSonicKeyDto.prototype, "contentEncoding", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], CreateSonicKeyDto.prototype, "contentSamplingFrequency", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], CreateSonicKeyDto.prototype, "contentName", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], CreateSonicKeyDto.prototype, "contentOwner", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Boolean)
], CreateSonicKeyDto.prototype, "contentValidation", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], CreateSonicKeyDto.prototype, "contentFileName", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], CreateSonicKeyDto.prototype, "contentQuality", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Object)
], CreateSonicKeyDto.prototype, "additionalMetadata", void 0);
exports.CreateSonicKeyDto = CreateSonicKeyDto;
//# sourceMappingURL=createSonicKey.dto.js.map