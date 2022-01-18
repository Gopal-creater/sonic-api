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
exports.CreateDetectionFromHardwareDto = exports.CreateDetectionFromBinaryDto = exports.CreateDetectionDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const Enums_1 = require("../../../constants/Enums");
class CreateDetectionDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { radioStation: { required: true, type: () => String }, sonicKey: { required: true, type: () => String }, apiKey: { required: true, type: () => String }, licenseKey: { required: true, type: () => String }, owner: { required: true, type: () => String }, channel: { required: true, type: () => String }, channelUuid: { required: true, type: () => String }, detectedAt: { required: true, type: () => Date }, metaData: { required: false } };
    }
}
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], CreateDetectionDto.prototype, "radioStation", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], CreateDetectionDto.prototype, "sonicKey", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], CreateDetectionDto.prototype, "apiKey", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], CreateDetectionDto.prototype, "licenseKey", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], CreateDetectionDto.prototype, "owner", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], CreateDetectionDto.prototype, "channel", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], CreateDetectionDto.prototype, "channelUuid", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Date)
], CreateDetectionDto.prototype, "detectedAt", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Map)
], CreateDetectionDto.prototype, "metaData", void 0);
exports.CreateDetectionDto = CreateDetectionDto;
class CreateDetectionFromBinaryDto {
    constructor() {
        this.detectedAt = new Date();
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { sonicKey: { required: true, type: () => String }, detectedAt: { required: true, type: () => Date, default: new Date() }, metaData: { required: true } };
    }
}
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], CreateDetectionFromBinaryDto.prototype, "sonicKey", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Date)
], CreateDetectionFromBinaryDto.prototype, "detectedAt", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Map)
], CreateDetectionFromBinaryDto.prototype, "metaData", void 0);
exports.CreateDetectionFromBinaryDto = CreateDetectionFromBinaryDto;
class CreateDetectionFromHardwareDto {
    constructor() {
        this.detectedAt = new Date();
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { sonicKey: { required: true, type: () => String }, detectedAt: { required: true, type: () => Date, default: new Date() }, metaData: { required: true } };
    }
}
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], CreateDetectionFromHardwareDto.prototype, "sonicKey", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Date)
], CreateDetectionFromHardwareDto.prototype, "detectedAt", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Map)
], CreateDetectionFromHardwareDto.prototype, "metaData", void 0);
exports.CreateDetectionFromHardwareDto = CreateDetectionFromHardwareDto;
//# sourceMappingURL=create-detection.dto.js.map