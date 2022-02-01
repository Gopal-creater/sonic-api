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
exports.ValidationTestDto = exports.CreateUserDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const userexists_validation_1 = require("../validations/userexists.validation");
class CreateUserDto {
    constructor(data) {
        Object.assign(this, data);
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { _id: { required: true, type: () => String }, username: { required: true, type: () => String }, sub: { required: true, type: () => String }, email_verified: { required: false, type: () => Boolean }, phone_number_verified: { required: false, type: () => Boolean }, phone_number: { required: false, type: () => String }, email: { required: true, type: () => String }, user_status: { required: false, type: () => String }, enabled: { required: false, type: () => Boolean }, mfa_options: { required: false, type: () => [Object] } };
    }
}
__decorate([
    class_validator_1.IsNotEmpty(),
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "_id", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "username", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "sub", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Boolean)
], CreateUserDto.prototype, "email_verified", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Boolean)
], CreateUserDto.prototype, "phone_number_verified", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "phone_number", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "email", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "user_status", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Boolean)
], CreateUserDto.prototype, "enabled", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Array)
], CreateUserDto.prototype, "mfa_options", void 0);
exports.CreateUserDto = CreateUserDto;
class ValidationTestDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { user: { required: true, type: () => String }, param1: { required: true, type: () => String } };
    }
}
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.Validate(userexists_validation_1.UserExistsRule),
    __metadata("design:type", String)
], ValidationTestDto.prototype, "user", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], ValidationTestDto.prototype, "param1", void 0);
exports.ValidationTestDto = ValidationTestDto;
//# sourceMappingURL=create-user.dto.js.map