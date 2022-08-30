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
exports.CreateSonicKeyDto = exports.CreateSonicKeyFromBinaryDto = exports.CreateSonicKeyFromJobDto = void 0;
const openapi = require("@nestjs/swagger");
const sonicKey_dto_1 = require("./sonicKey.dto");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const distributorTypes = require("../constants/distributor.constant.json");
const labelTypes = require("../constants/label.constant.json");
class CreateSonicKeyFromJobDto extends sonicKey_dto_1.SonicKeyDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { sonicKey: { required: true, type: () => String }, contentFilePath: { required: true, type: () => String }, job: { required: true, type: () => String }, owner: { required: true, type: () => String }, license: { required: true, type: () => String }, licenseId: { required: true, type: () => String } };
    }
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateSonicKeyFromJobDto.prototype, "sonicKey", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateSonicKeyFromJobDto.prototype, "contentFilePath", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateSonicKeyFromJobDto.prototype, "job", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateSonicKeyFromJobDto.prototype, "owner", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateSonicKeyFromJobDto.prototype, "license", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateSonicKeyFromJobDto.prototype, "licenseId", void 0);
exports.CreateSonicKeyFromJobDto = CreateSonicKeyFromJobDto;
class CreateSonicKeyFromBinaryDto extends sonicKey_dto_1.SonicKeyDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { sonicKey: { required: true, type: () => String }, contentFilePath: { required: true, type: () => String }, originalFileName: { required: true, type: () => String } };
    }
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateSonicKeyFromBinaryDto.prototype, "sonicKey", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateSonicKeyFromBinaryDto.prototype, "contentFilePath", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateSonicKeyFromBinaryDto.prototype, "originalFileName", void 0);
exports.CreateSonicKeyFromBinaryDto = CreateSonicKeyFromBinaryDto;
class S3FileMetaDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { ETag: { required: true, type: () => String }, Location: { required: true, type: () => String }, key: { required: false, type: () => String }, Key: { required: true, type: () => String }, Bucket: { required: true, type: () => String } };
    }
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], S3FileMetaDto.prototype, "ETag", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], S3FileMetaDto.prototype, "Location", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], S3FileMetaDto.prototype, "key", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], S3FileMetaDto.prototype, "Key", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], S3FileMetaDto.prototype, "Bucket", void 0);
class CreateSonicKeyDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { sonicKey: { required: false, type: () => String }, owner: { required: false, type: () => String }, company: { required: false, type: () => String }, partner: { required: false, type: () => String }, channel: { required: true, type: () => String }, channelUuid: { required: true, type: () => String }, encodingStrength: { required: false, type: () => Number }, contentType: { required: false, type: () => String }, contentDescription: { required: false, type: () => String }, contentCreatedDate: { required: false, type: () => Date }, contentDuration: { required: false, type: () => Number }, contentSize: { required: false, type: () => Number }, contentFilePath: { required: false, type: () => String }, s3FileMeta: { required: false, type: () => S3FileMetaDto }, s3OriginalFileMeta: { required: false, type: () => S3FileMetaDto }, contentFileType: { required: false, type: () => String }, contentEncoding: { required: false, type: () => String }, contentSamplingFrequency: { required: true, type: () => String }, isrcCode: { required: false, type: () => String }, iswcCode: { required: false, type: () => String }, tuneCode: { required: false, type: () => String }, contentName: { required: false, type: () => String }, contentOwner: { required: false, type: () => String }, contentValidation: { required: false, type: () => Boolean }, contentFileName: { required: false, type: () => String }, originalFileName: { required: false, type: () => String }, contentQuality: { required: false, type: () => String }, additionalMetadata: { required: false }, isRightsHolderForEncode: { required: false, type: () => Boolean }, isAuthorizedForEncode: { required: false, type: () => Boolean }, distributor: { required: false, type: () => String, enum: distributorTypes }, version: { required: false, type: () => String }, label: { required: false, type: () => String, enum: labelTypes }, createdBy: { required: false, type: () => String }, updatedBy: { required: false, type: () => String } };
    }
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateSonicKeyDto.prototype, "sonicKey", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateSonicKeyDto.prototype, "owner", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateSonicKeyDto.prototype, "company", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateSonicKeyDto.prototype, "partner", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateSonicKeyDto.prototype, "channel", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateSonicKeyDto.prototype, "channelUuid", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CreateSonicKeyDto.prototype, "encodingStrength", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateSonicKeyDto.prototype, "contentType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateSonicKeyDto.prototype, "contentDescription", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], CreateSonicKeyDto.prototype, "contentCreatedDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CreateSonicKeyDto.prototype, "contentDuration", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CreateSonicKeyDto.prototype, "contentSize", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateSonicKeyDto.prototype, "contentFilePath", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", S3FileMetaDto)
], CreateSonicKeyDto.prototype, "s3FileMeta", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", S3FileMetaDto)
], CreateSonicKeyDto.prototype, "s3OriginalFileMeta", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateSonicKeyDto.prototype, "contentFileType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateSonicKeyDto.prototype, "contentEncoding", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateSonicKeyDto.prototype, "contentSamplingFrequency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateSonicKeyDto.prototype, "isrcCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateSonicKeyDto.prototype, "iswcCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateSonicKeyDto.prototype, "tuneCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateSonicKeyDto.prototype, "contentName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateSonicKeyDto.prototype, "contentOwner", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], CreateSonicKeyDto.prototype, "contentValidation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateSonicKeyDto.prototype, "contentFileName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateSonicKeyDto.prototype, "originalFileName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateSonicKeyDto.prototype, "contentQuality", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Map)
], CreateSonicKeyDto.prototype, "additionalMetadata", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], CreateSonicKeyDto.prototype, "isRightsHolderForEncode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], CreateSonicKeyDto.prototype, "isAuthorizedForEncode", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(distributorTypes),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateSonicKeyDto.prototype, "distributor", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateSonicKeyDto.prototype, "version", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(labelTypes),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateSonicKeyDto.prototype, "label", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateSonicKeyDto.prototype, "createdBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateSonicKeyDto.prototype, "updatedBy", void 0);
exports.CreateSonicKeyDto = CreateSonicKeyDto;
//# sourceMappingURL=create-sonickey.dto.js.map