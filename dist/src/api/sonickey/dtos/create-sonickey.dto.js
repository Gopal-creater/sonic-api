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
exports.CreateSonicKeyFromBinaryDto = exports.CreateSonicKeyFromJobDto = void 0;
const openapi = require("@nestjs/swagger");
const sonicKey_dto_1 = require("./sonicKey.dto");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateSonicKeyFromJobDto extends sonicKey_dto_1.SonicKeyDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { sonicKey: { required: true, type: () => String }, job: { required: true, type: () => String }, owner: { required: true, type: () => String }, license: { required: true, type: () => String }, licenseId: { required: true, type: () => String } };
    }
}
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], CreateSonicKeyFromJobDto.prototype, "sonicKey", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], CreateSonicKeyFromJobDto.prototype, "job", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], CreateSonicKeyFromJobDto.prototype, "owner", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], CreateSonicKeyFromJobDto.prototype, "license", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], CreateSonicKeyFromJobDto.prototype, "licenseId", void 0);
exports.CreateSonicKeyFromJobDto = CreateSonicKeyFromJobDto;
class CreateSonicKeyFromBinaryDto extends sonicKey_dto_1.SonicKeyDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { sonicKey: { required: true, type: () => String }, license: { required: true, type: () => String } };
    }
}
__decorate([
    class_validator_1.IsNotEmpty(),
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], CreateSonicKeyFromBinaryDto.prototype, "sonicKey", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], CreateSonicKeyFromBinaryDto.prototype, "license", void 0);
exports.CreateSonicKeyFromBinaryDto = CreateSonicKeyFromBinaryDto;
//# sourceMappingURL=create-sonickey.dto.js.map