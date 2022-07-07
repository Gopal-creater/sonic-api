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
exports.CreateDetectionFromHardwareDto = exports.CreateThirdPartyStreamReaderDetectionFromFingerPrintDto = exports.CreateThirdPartyStreamReaderDetectionFromLamdaDto = exports.CreateThirdPartyStreamReaderDetectionFromBinaryDto = exports.ThirdPartyStreamReaderDetectionDto = exports.CreateDetectionFromBinaryDto = exports.CreateDetectionDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const Enums_1 = require("../../../constants/Enums");
const class_validator_1 = require("class-validator");
const general_dto_1 = require("./general.dto");
const class_transformer_1 = require("class-transformer");
class CreateDetectionDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { radioStation: { required: true, type: () => String }, sonicKey: { required: true, type: () => String }, channel: { required: true, type: () => String }, detectedAt: { required: true, type: () => Date }, metaData: { required: false } };
    }
}
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], CreateDetectionDto.prototype, "radioStation", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", String)
], CreateDetectionDto.prototype, "sonicKey", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    swagger_1.ApiProperty(),
    class_validator_1.IsIn([Object.values(Enums_1.ChannelEnums)]),
    __metadata("design:type", String)
], CreateDetectionDto.prototype, "channel", void 0);
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
class ThirdPartyStreamReaderDetectionDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { country: { required: true, type: () => String }, name: { required: true, type: () => String }, detectedAt: { required: true, type: () => Date }, metaData: { required: true } };
    }
}
__decorate([
    class_validator_1.IsNotEmpty(),
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], ThirdPartyStreamReaderDetectionDto.prototype, "country", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], ThirdPartyStreamReaderDetectionDto.prototype, "name", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    swagger_1.ApiProperty(),
    __metadata("design:type", Date)
], ThirdPartyStreamReaderDetectionDto.prototype, "detectedAt", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Map)
], ThirdPartyStreamReaderDetectionDto.prototype, "metaData", void 0);
exports.ThirdPartyStreamReaderDetectionDto = ThirdPartyStreamReaderDetectionDto;
class CreateThirdPartyStreamReaderDetectionFromBinaryDto {
    constructor() {
        this.detectedAt = new Date();
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { sonicKey: { required: true, type: () => String }, detectedAt: { required: true, type: () => Date, default: new Date() }, metaData: { required: true }, thirdpartyStreamReaderDetection: { required: true, type: () => require("./create-detection.dto").ThirdPartyStreamReaderDetectionDto } };
    }
}
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", String)
], CreateThirdPartyStreamReaderDetectionFromBinaryDto.prototype, "sonicKey", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsOptional(),
    __metadata("design:type", Date)
], CreateThirdPartyStreamReaderDetectionFromBinaryDto.prototype, "detectedAt", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsOptional(),
    __metadata("design:type", Map)
], CreateThirdPartyStreamReaderDetectionFromBinaryDto.prototype, "metaData", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    swagger_1.ApiProperty(),
    __metadata("design:type", ThirdPartyStreamReaderDetectionDto)
], CreateThirdPartyStreamReaderDetectionFromBinaryDto.prototype, "thirdpartyStreamReaderDetection", void 0);
exports.CreateThirdPartyStreamReaderDetectionFromBinaryDto = CreateThirdPartyStreamReaderDetectionFromBinaryDto;
class CreateThirdPartyStreamReaderDetectionFromLamdaDto {
    constructor() {
        this.detectedAt = new Date();
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { decodeResponsesFromBinary: { required: true, type: () => [require("./general.dto").DecodeResponseFromBinaryDto] }, radioStation: { required: true, type: () => String }, detectedAt: { required: true, type: () => Date, default: new Date() }, streamDetectionInterval: { required: true, type: () => Number }, detectionSourceFileName: { required: true, type: () => String }, metaData: { required: true } };
    }
}
__decorate([
    swagger_1.ApiProperty({ isArray: true, type: general_dto_1.DecodeResponseFromBinaryDto }),
    class_validator_1.IsDefined(),
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsArray(),
    class_validator_1.ValidateNested({ each: true }),
    class_transformer_1.Type(() => general_dto_1.DecodeResponseFromBinaryDto),
    __metadata("design:type", Array)
], CreateThirdPartyStreamReaderDetectionFromLamdaDto.prototype, "decodeResponsesFromBinary", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", String)
], CreateThirdPartyStreamReaderDetectionFromLamdaDto.prototype, "radioStation", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsOptional(),
    __metadata("design:type", Date)
], CreateThirdPartyStreamReaderDetectionFromLamdaDto.prototype, "detectedAt", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", Number)
], CreateThirdPartyStreamReaderDetectionFromLamdaDto.prototype, "streamDetectionInterval", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], CreateThirdPartyStreamReaderDetectionFromLamdaDto.prototype, "detectionSourceFileName", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsOptional(),
    __metadata("design:type", Map)
], CreateThirdPartyStreamReaderDetectionFromLamdaDto.prototype, "metaData", void 0);
exports.CreateThirdPartyStreamReaderDetectionFromLamdaDto = CreateThirdPartyStreamReaderDetectionFromLamdaDto;
class CreateThirdPartyStreamReaderDetectionFromFingerPrintDto {
    constructor() {
        this.detectedAt = new Date();
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { decodeResponsesFromFingerPrint: { required: true, type: () => [require("./general.dto").DecodeResponseFromFingerPrintDto] }, radioStation: { required: true, type: () => String }, detectedAt: { required: true, type: () => Date, default: new Date() }, streamDetectionInterval: { required: true, type: () => Number }, detectionSourceFileName: { required: true, type: () => String }, metaData: { required: true } };
    }
}
__decorate([
    swagger_1.ApiProperty({ isArray: true, type: general_dto_1.DecodeResponseFromFingerPrintDto }),
    class_validator_1.IsDefined(),
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsArray(),
    class_validator_1.ValidateNested({ each: true }),
    class_transformer_1.Type(() => general_dto_1.DecodeResponseFromFingerPrintDto),
    __metadata("design:type", Array)
], CreateThirdPartyStreamReaderDetectionFromFingerPrintDto.prototype, "decodeResponsesFromFingerPrint", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", String)
], CreateThirdPartyStreamReaderDetectionFromFingerPrintDto.prototype, "radioStation", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsOptional(),
    __metadata("design:type", Date)
], CreateThirdPartyStreamReaderDetectionFromFingerPrintDto.prototype, "detectedAt", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", Number)
], CreateThirdPartyStreamReaderDetectionFromFingerPrintDto.prototype, "streamDetectionInterval", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], CreateThirdPartyStreamReaderDetectionFromFingerPrintDto.prototype, "detectionSourceFileName", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsOptional(),
    __metadata("design:type", Map)
], CreateThirdPartyStreamReaderDetectionFromFingerPrintDto.prototype, "metaData", void 0);
exports.CreateThirdPartyStreamReaderDetectionFromFingerPrintDto = CreateThirdPartyStreamReaderDetectionFromFingerPrintDto;
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