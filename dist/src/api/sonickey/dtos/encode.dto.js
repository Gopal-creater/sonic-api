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
exports.EncodeFromQueueDto = exports.QueueFileSpecDto = exports.EncodeFromUrlDto = exports.EncodeFromTrackDto = exports.EncodeFromFileDto = exports.EncodeDto = void 0;
const openapi = require("@nestjs/swagger");
const sonicKey_dto_1 = require("./sonicKey.dto");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const create_sonickey_dto_1 = require("./create-sonickey.dto");
class EncodeDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { mediaFile: { required: true, type: () => Object }, data: { required: true, type: () => require("./sonicKey.dto").SonicKeyDto } };
    }
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({ type: 'string', format: 'binary' }),
    __metadata("design:type", Object)
], EncodeDto.prototype, "mediaFile", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Transform)(value => (0, class_transformer_1.plainToClass)(sonicKey_dto_1.SonicKeyDto, JSON.parse(value))),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", sonicKey_dto_1.SonicKeyDto)
], EncodeDto.prototype, "data", void 0);
exports.EncodeDto = EncodeDto;
class EncodeFromFileDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { mediaFile: { required: true, type: () => Object }, data: { required: true, type: () => require("./create-sonickey.dto").CreateSonicKeyDto } };
    }
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({ type: 'string', format: 'binary' }),
    __metadata("design:type", Object)
], EncodeFromFileDto.prototype, "mediaFile", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => create_sonickey_dto_1.CreateSonicKeyDto),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", create_sonickey_dto_1.CreateSonicKeyDto)
], EncodeFromFileDto.prototype, "data", void 0);
exports.EncodeFromFileDto = EncodeFromFileDto;
class EncodeFromTrackDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { track: { required: true, type: () => String }, data: { required: true, type: () => require("./create-sonickey.dto").CreateSonicKeyDto } };
    }
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], EncodeFromTrackDto.prototype, "track", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", create_sonickey_dto_1.CreateSonicKeyDto)
], EncodeFromTrackDto.prototype, "data", void 0);
exports.EncodeFromTrackDto = EncodeFromTrackDto;
class EncodeFromUrlDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { mediaFile: { required: true, type: () => String }, data: { required: true, type: () => require("./create-sonickey.dto").CreateSonicKeyDto } };
    }
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], EncodeFromUrlDto.prototype, "mediaFile", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", create_sonickey_dto_1.CreateSonicKeyDto)
], EncodeFromUrlDto.prototype, "data", void 0);
exports.EncodeFromUrlDto = EncodeFromUrlDto;
class QueueFileSpecDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { filePath: { required: true, type: () => String }, metaData: { required: true, type: () => require("./sonicKey.dto").SonicKeyDto } };
    }
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], QueueFileSpecDto.prototype, "filePath", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", sonicKey_dto_1.SonicKeyDto)
], QueueFileSpecDto.prototype, "metaData", void 0);
exports.QueueFileSpecDto = QueueFileSpecDto;
class EncodeFromQueueDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { fileSpecs: { required: true }, license: { required: false, type: () => String } };
    }
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => QueueFileSpecDto),
    (0, class_validator_1.ArrayMinSize)(1),
    (0, class_validator_1.ArrayMaxSize)(100),
    (0, swagger_1.ApiProperty)({ type: [QueueFileSpecDto] }),
    __metadata("design:type", Array)
], EncodeFromQueueDto.prototype, "fileSpecs", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], EncodeFromQueueDto.prototype, "license", void 0);
exports.EncodeFromQueueDto = EncodeFromQueueDto;
//# sourceMappingURL=encode.dto.js.map