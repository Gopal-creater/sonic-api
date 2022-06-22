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
exports.UploadTrackDto = exports.TrackDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const sonickey_schema_1 = require("../../sonickey/schemas/sonickey.schema");
class TrackDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { owner: { required: true, type: () => String }, company: { required: true, type: () => String }, partner: { required: true, type: () => String }, apiKey: { required: true, type: () => Object }, channel: { required: true, type: () => String }, channelUuid: { required: true, type: () => String }, license: { required: true, type: () => String }, mimeType: { required: true, type: () => String }, artist: { required: true, type: () => String }, title: { required: true, type: () => String }, duration: { required: false, type: () => Number }, fileSize: { required: false, type: () => Number }, localFilePath: { required: true, type: () => String }, s3OriginalFileMeta: { required: false, type: () => require("../../sonickey/schemas/sonickey.schema").S3FileMeta }, fileType: { required: true, type: () => String }, encoding: { required: true, type: () => String }, samplingFrequency: { required: true, type: () => String }, originalFileName: { required: true, type: () => String }, iExtractedMetaData: { required: true, type: () => Object }, createdByUser: { required: true, type: () => String }, updatedByUser: { required: true, type: () => String }, trackMetaData: { required: true, type: () => Object } };
    }
}
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], TrackDto.prototype, "owner", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], TrackDto.prototype, "company", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], TrackDto.prototype, "partner", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Object)
], TrackDto.prototype, "apiKey", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], TrackDto.prototype, "channel", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], TrackDto.prototype, "channelUuid", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], TrackDto.prototype, "license", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], TrackDto.prototype, "mimeType", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], TrackDto.prototype, "artist", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], TrackDto.prototype, "title", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Number)
], TrackDto.prototype, "duration", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Number)
], TrackDto.prototype, "fileSize", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], TrackDto.prototype, "localFilePath", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", sonickey_schema_1.S3FileMeta)
], TrackDto.prototype, "s3OriginalFileMeta", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], TrackDto.prototype, "fileType", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], TrackDto.prototype, "encoding", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], TrackDto.prototype, "samplingFrequency", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], TrackDto.prototype, "originalFileName", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Object)
], TrackDto.prototype, "iExtractedMetaData", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], TrackDto.prototype, "createdByUser", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], TrackDto.prototype, "updatedByUser", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Object)
], TrackDto.prototype, "trackMetaData", void 0);
exports.TrackDto = TrackDto;
class UploadTrackDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { mediaFile: { required: true, type: () => Object }, channel: { required: false, type: () => String }, artist: { required: true, type: () => String }, title: { required: true, type: () => String }, owner: { required: false, type: () => String }, company: { required: false, type: () => String }, partner: { required: false, type: () => String } };
    }
}
__decorate([
    class_validator_1.IsNotEmpty(),
    swagger_1.ApiProperty({ type: 'string', format: 'binary' }),
    __metadata("design:type", Object)
], UploadTrackDto.prototype, "mediaFile", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], UploadTrackDto.prototype, "channel", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", String)
], UploadTrackDto.prototype, "artist", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", String)
], UploadTrackDto.prototype, "title", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], UploadTrackDto.prototype, "owner", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], UploadTrackDto.prototype, "company", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], UploadTrackDto.prototype, "partner", void 0);
exports.UploadTrackDto = UploadTrackDto;
//# sourceMappingURL=create-track.dto.js.map