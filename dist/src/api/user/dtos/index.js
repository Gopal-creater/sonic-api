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
exports.CognitoCreateUserDTO = exports.UpdateProfileDto = exports.AddBulkNewLicensesDto = exports.RemoveUserFromCompanyDto = exports.MakeAdminCompanyDto = exports.AddUserToCompanyDto = exports.RemoveUserFromGroupDto = exports.AddUserToGroupDto = exports.AddNewLicenseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class AddNewLicenseDto {
}
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], AddNewLicenseDto.prototype, "licenseKey", void 0);
exports.AddNewLicenseDto = AddNewLicenseDto;
class AddUserToGroupDto {
}
__decorate([
    class_validator_1.IsNotEmpty(),
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], AddUserToGroupDto.prototype, "user", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], AddUserToGroupDto.prototype, "group", void 0);
exports.AddUserToGroupDto = AddUserToGroupDto;
class RemoveUserFromGroupDto {
}
__decorate([
    class_validator_1.IsNotEmpty(),
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], RemoveUserFromGroupDto.prototype, "user", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], RemoveUserFromGroupDto.prototype, "group", void 0);
exports.RemoveUserFromGroupDto = RemoveUserFromGroupDto;
class AddUserToCompanyDto {
}
__decorate([
    class_validator_1.IsNotEmpty(),
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], AddUserToCompanyDto.prototype, "user", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], AddUserToCompanyDto.prototype, "company", void 0);
exports.AddUserToCompanyDto = AddUserToCompanyDto;
class MakeAdminCompanyDto {
}
__decorate([
    class_validator_1.IsNotEmpty(),
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], MakeAdminCompanyDto.prototype, "user", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], MakeAdminCompanyDto.prototype, "company", void 0);
exports.MakeAdminCompanyDto = MakeAdminCompanyDto;
class RemoveUserFromCompanyDto {
}
__decorate([
    class_validator_1.IsNotEmpty(),
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], RemoveUserFromCompanyDto.prototype, "user", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], RemoveUserFromCompanyDto.prototype, "company", void 0);
exports.RemoveUserFromCompanyDto = RemoveUserFromCompanyDto;
class AddBulkNewLicensesDto {
}
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Array)
], AddBulkNewLicensesDto.prototype, "licenseKeys", void 0);
exports.AddBulkNewLicensesDto = AddBulkNewLicensesDto;
class UpdateProfileDto {
}
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Array)
], UpdateProfileDto.prototype, "attributes", void 0);
exports.UpdateProfileDto = UpdateProfileDto;
class CognitoCreateUserDTO {
}
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", String)
], CognitoCreateUserDTO.prototype, "userName", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", String)
], CognitoCreateUserDTO.prototype, "password", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], CognitoCreateUserDTO.prototype, "phoneNumber", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", String)
], CognitoCreateUserDTO.prototype, "email", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Boolean)
], CognitoCreateUserDTO.prototype, "isEmailVerified", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Boolean)
], CognitoCreateUserDTO.prototype, "isPhoneNumberVerified", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], CognitoCreateUserDTO.prototype, "group", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], CognitoCreateUserDTO.prototype, "company", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Boolean)
], CognitoCreateUserDTO.prototype, "sendInvitationByEmail", void 0);
exports.CognitoCreateUserDTO = CognitoCreateUserDTO;
//# sourceMappingURL=index.js.map