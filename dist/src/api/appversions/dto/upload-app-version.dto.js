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
exports.UploadAppVersionDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const version_dto_1 = require("./version.dto");
class UploadAppVersionDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { mediaFile: { required: true, type: () => Object }, data: { required: true, type: () => require("./version.dto").Version } };
    }
}
__decorate([
    class_validator_1.IsNotEmpty(),
    swagger_1.ApiProperty({ type: 'string', format: 'binary' }),
    __metadata("design:type", Object)
], UploadAppVersionDto.prototype, "mediaFile", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", version_dto_1.Version)
], UploadAppVersionDto.prototype, "data", void 0);
exports.UploadAppVersionDto = UploadAppVersionDto;
//# sourceMappingURL=upload-app-version.dto.js.map