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
exports.LicenseValidationGuard = void 0;
const common_1 = require("@nestjs/common");
const licensekey_service_1 = require("../../licensekey/services/licensekey.service");
let LicenseValidationGuard = class LicenseValidationGuard {
    constructor(licensekeyService) {
        this.licensekeyService = licensekeyService;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        const ownerKey = `owner${user === null || user === void 0 ? void 0 : user.sub}`.replace(/-/g, '');
        const data = await this.licensekeyService.licenseKeyModel.find({ "owners.ownerId": user.sub });
        if (!data || data.length <= 0) {
            throw new common_1.UnprocessableEntityException("No License keys present. Please add a License key.");
        }
        let currentValidLicense;
        for (let index = 0; index < data.length; index++) {
            const license = data[index];
            if (await this.isValidLicense(license.key)) {
                currentValidLicense = license;
                break;
            }
        }
        request.validLicense = currentValidLicense;
        return Boolean(currentValidLicense);
    }
    async isValidLicense(id) {
        const { validationResult, licenseKey } = await this.licensekeyService.validateLicence(id);
        if (!validationResult.valid) {
            return false;
        }
        const uses = licenseKey.encodeUses;
        const maxUses = licenseKey.maxEncodeUses;
        if (uses > maxUses) {
            return false;
        }
        return true;
    }
};
LicenseValidationGuard = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [licensekey_service_1.LicensekeyService])
], LicenseValidationGuard);
exports.LicenseValidationGuard = LicenseValidationGuard;
//# sourceMappingURL=license-validation.guard.js.map