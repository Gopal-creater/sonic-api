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
exports.EncodeDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class EncodeDto {
    constructor() {
        this.encodingStrength = 10;
    }
}
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], EncodeDto.prototype, "owner", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Number)
], EncodeDto.prototype, "encodingStrength", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], EncodeDto.prototype, "contentType", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], EncodeDto.prototype, "contentDescription", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Date)
], EncodeDto.prototype, "contentCreatedDate", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Number)
], EncodeDto.prototype, "contentDuration", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Number)
], EncodeDto.prototype, "contentSize", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], EncodeDto.prototype, "contentFilePath", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], EncodeDto.prototype, "contentFileType", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], EncodeDto.prototype, "contentEncoding", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], EncodeDto.prototype, "contentSamplingFrequency", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], EncodeDto.prototype, "contentName", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], EncodeDto.prototype, "contentOwner", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Boolean)
], EncodeDto.prototype, "contentValidation", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], EncodeDto.prototype, "contentFileName", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], EncodeDto.prototype, "contentQuality", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Object)
], EncodeDto.prototype, "additionalMetadata", void 0);
exports.EncodeDto = EncodeDto;
//# sourceMappingURL=encode.dto copy.js.map