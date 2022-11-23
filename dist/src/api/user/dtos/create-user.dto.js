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
const Enums_1 = require("../../../constants/Enums");
const index_1 = require("../../../constants/index");
const mongoose_1 = require("mongoose");
const common_1 = require("@nestjs/common");
class CreateUserDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { userName: { required: true, type: () => String }, name: { required: false, type: () => String }, firstName: { required: false, type: () => String }, lastName: { required: false, type: () => String }, password: { required: true, type: () => String }, phoneNumber: { required: false, type: () => String }, country: { required: false, type: () => String }, email: { required: true, type: () => String }, isEmailVerified: { required: false, type: () => Boolean }, isPhoneNumberVerified: { required: false, type: () => Boolean }, userRole: { required: false, enum: require("../../../constants/Enums").SystemRoles }, company: { required: false, type: () => String }, partner: { required: false, type: () => String }, sendInvitationByEmail: { required: false, type: () => Boolean } };
    }
}
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "userName", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "name", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "firstName", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "lastName", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsNotEmpty(),
    class_validator_1.Matches(index_1.COGNITO_PASSWORD_REGULAR_EXPRESSION, {
        message: 'password too weak',
    }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "password", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "phoneNumber", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "country", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "email", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Boolean)
], CreateUserDto.prototype, "isEmailVerified", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Boolean)
], CreateUserDto.prototype, "isPhoneNumberVerified", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsEnum(Enums_1.SystemRoles),
    __metadata("design:type", String)
], CreateUserDto.prototype, "userRole", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "company", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "partner", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Boolean)
], CreateUserDto.prototype, "sendInvitationByEmail", void 0);
exports.CreateUserDto = CreateUserDto;
function toMongoObjectId({ value, key }) {
    if (mongoose_1.Types.ObjectId.isValid(value) && (new mongoose_1.Types.ObjectId(value).toString() === value)) {
        return new mongoose_1.Types.ObjectId(value);
    }
    else {
        throw new common_1.BadRequestException(`${key} is not a valid MongoId`);
    }
}
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