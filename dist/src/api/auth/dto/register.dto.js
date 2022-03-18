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
exports.WpmsUserRegisterDTO = exports.RegisterDTO = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const constants_1 = require("../../../constants");
class RegisterDTO {
    static _OPENAPI_METADATA_FACTORY() {
        return { userName: { required: true, type: () => String }, password: { required: true, type: () => String }, phoneNumber: { required: false, type: () => String }, email: { required: true, type: () => String } };
    }
}
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", String)
], RegisterDTO.prototype, "userName", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", String)
], RegisterDTO.prototype, "password", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], RegisterDTO.prototype, "phoneNumber", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", String)
], RegisterDTO.prototype, "email", void 0);
exports.RegisterDTO = RegisterDTO;
class WpmsUserRegisterDTO {
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: true, type: () => String }, userName: { required: true, type: () => String }, password: { required: true, type: () => String }, phoneNumber: { required: false, type: () => String }, country: { required: false, type: () => String }, email: { required: true, type: () => String } };
    }
}
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", String)
], WpmsUserRegisterDTO.prototype, "name", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", String)
], WpmsUserRegisterDTO.prototype, "userName", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsNotEmpty(),
    class_validator_1.Matches(constants_1.COGNITO_PASSWORD_REGULAR_EXPRESSION, {
        message: 'password too weak',
    }),
    __metadata("design:type", String)
], WpmsUserRegisterDTO.prototype, "password", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], WpmsUserRegisterDTO.prototype, "phoneNumber", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], WpmsUserRegisterDTO.prototype, "country", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsEmail(),
    __metadata("design:type", String)
], WpmsUserRegisterDTO.prototype, "email", void 0);
exports.WpmsUserRegisterDTO = WpmsUserRegisterDTO;
//# sourceMappingURL=register.dto.js.map