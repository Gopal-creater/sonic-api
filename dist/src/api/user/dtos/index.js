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
exports.AdminCreateUserDTO = exports.UpdateProfileDto = exports.AddBulkNewLicensesDto = exports.AddNewLicenseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const register_dto_1 = require("../../auth/dto/register.dto");
class AddNewLicenseDto {
}
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], AddNewLicenseDto.prototype, "licenseKey", void 0);
exports.AddNewLicenseDto = AddNewLicenseDto;
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
class AdminCreateUserDTO extends register_dto_1.RegisterDTO {
}
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Boolean)
], AdminCreateUserDTO.prototype, "isEmailVerified", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Boolean)
], AdminCreateUserDTO.prototype, "isPhoneNumberVerified", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], AdminCreateUserDTO.prototype, "group", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Boolean)
], AdminCreateUserDTO.prototype, "sendInvitationByEmail", void 0);
exports.AdminCreateUserDTO = AdminCreateUserDTO;
//# sourceMappingURL=index.js.map