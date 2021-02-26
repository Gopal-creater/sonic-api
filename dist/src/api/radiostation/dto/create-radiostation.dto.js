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
exports.CreateRadiostationDto = exports.Credential = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
class Credential {
    static _OPENAPI_METADATA_FACTORY() {
        return { username: { required: true, type: () => String }, password: { required: true, type: () => String } };
    }
}
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], Credential.prototype, "username", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], Credential.prototype, "password", void 0);
exports.Credential = Credential;
class CreateRadiostationDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: true, type: () => String }, streamingUrl: { required: true, type: () => String }, website: { required: false, type: () => String }, logo: { required: false, type: () => String }, credential: { required: false, type: () => require("./create-radiostation.dto").Credential }, owner: { required: true, type: () => String } };
    }
}
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], CreateRadiostationDto.prototype, "name", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], CreateRadiostationDto.prototype, "streamingUrl", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], CreateRadiostationDto.prototype, "website", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], CreateRadiostationDto.prototype, "logo", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Credential)
], CreateRadiostationDto.prototype, "credential", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], CreateRadiostationDto.prototype, "owner", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Object)
], CreateRadiostationDto.prototype, "logs", void 0);
exports.CreateRadiostationDto = CreateRadiostationDto;
//# sourceMappingURL=create-radiostation.dto.js.map