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
exports.AddUserToLicense = exports.UpdateLicensekeyDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const create_licensekey_dto_1 = require("./create-licensekey.dto");
class UpdateLicensekeyDto extends (0, swagger_1.PartialType)((0, swagger_1.OmitType)(create_licensekey_dto_1.CreateLicensekeyDto, ['type', 'company', 'user'])) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateLicensekeyDto = UpdateLicensekeyDto;
class AddUserToLicense {
    static _OPENAPI_METADATA_FACTORY() {
        return { user: { required: true, type: () => String } };
    }
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], AddUserToLicense.prototype, "user", void 0);
exports.AddUserToLicense = AddUserToLicense;
//# sourceMappingURL=update-licensekey.dto.js.map