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
exports.EditPartnerUserDto = exports.CreatePartnerUserDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreatePartnerUserDto {
}
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", String)
], CreatePartnerUserDto.prototype, "userName", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", String)
], CreatePartnerUserDto.prototype, "password", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], CreatePartnerUserDto.prototype, "phoneNumber", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", String)
], CreatePartnerUserDto.prototype, "email", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Boolean)
], CreatePartnerUserDto.prototype, "isEmailVerified", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Boolean)
], CreatePartnerUserDto.prototype, "isPhoneNumberVerified", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], CreatePartnerUserDto.prototype, "company", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Boolean)
], CreatePartnerUserDto.prototype, "sendInvitationByEmail", void 0);
exports.CreatePartnerUserDto = CreatePartnerUserDto;
class EditPartnerUserDto {
}
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], EditPartnerUserDto.prototype, "name", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], EditPartnerUserDto.prototype, "phoneNumber", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], EditPartnerUserDto.prototype, "country", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Boolean)
], EditPartnerUserDto.prototype, "enabled", void 0);
exports.EditPartnerUserDto = EditPartnerUserDto;
//# sourceMappingURL=partner-user.js.map