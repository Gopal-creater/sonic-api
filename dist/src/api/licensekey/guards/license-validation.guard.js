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
exports.SubscribeRadioMonitorLicenseValidationGuard = exports.LicenseValidationGuard = void 0;
const common_1 = require("@nestjs/common");
const licensekey_schema_1 = require("../schemas/licensekey.schema");
const licensekey_service_1 = require("../services/licensekey.service");
let LicenseValidationGuard = class LicenseValidationGuard {
    constructor(licensekeyService) {
        this.licensekeyService = licensekeyService;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        const data = await this.licensekeyService.licenseKeyModel.find({ "owners.ownerId": user.sub });
        if (!data || data.length <= 0) {
            throw new common_1.UnprocessableEntityException("No License keys present. Please add a license key to subscribe for encode.");
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
            throw new common_1.UnprocessableEntityException({ message: validationResult.message });
        }
        if (licenseKey.isUnlimitedEncode) {
            return true;
        }
        var reservedLicenceCount = 0;
        if (licenseKey.reserves && Array.isArray(licenseKey.reserves)) {
            reservedLicenceCount = licenseKey.reserves.reduce((sum, { count }) => sum + count, 0);
        }
        const uses = licenseKey.encodeUses;
        const maxUses = licenseKey.maxEncodeUses;
        const remainingUses = maxUses - uses;
        const remaniningUsesAfterReservedCount = remainingUses - reservedLicenceCount;
        const usesToBeUsed = 1;
        if (remaniningUsesAfterReservedCount < usesToBeUsed) {
            throw new common_1.UnprocessableEntityException({
                message: 'Error deuto your maximum license usage count exceeded.',
                remainingUsages: remainingUses,
                reservedLicenceCount: reservedLicenceCount,
                remaniningUsesAfterReservedCount: remaniningUsesAfterReservedCount,
                usesToBeUsed: usesToBeUsed,
            });
        }
        return true;
    }
};
LicenseValidationGuard = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [licensekey_service_1.LicensekeyService])
], LicenseValidationGuard);
exports.LicenseValidationGuard = LicenseValidationGuard;
let SubscribeRadioMonitorLicenseValidationGuard = class SubscribeRadioMonitorLicenseValidationGuard {
    constructor(licensekeyService) {
        this.licensekeyService = licensekeyService;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        const data = await this.licensekeyService.licenseKeyModel.find({ "owners.ownerId": user.sub });
        if (!data || data.length <= 0) {
            throw new common_1.UnprocessableEntityException("No License keys present. Please add a license key to subscribe for monitor.");
        }
        let currentValidLicense;
        for (let index = 0; index < data.length; index++) {
            const license = data[index];
            if (await this.isValidLicenseForMonitor(license.key, request.body)) {
                currentValidLicense = license;
                break;
            }
        }
        request.validLicense = currentValidLicense;
        return Boolean(currentValidLicense);
    }
    async isValidLicenseForMonitor(id, body) {
        const { validationResult, licenseKey } = await this.licensekeyService.validateLicence(id);
        if (!validationResult.valid) {
            throw new common_1.UnprocessableEntityException({ message: validationResult.message });
        }
        if (licenseKey.isUnlimitedMonitor) {
            return true;
        }
        const uses = licenseKey.monitoringUses;
        const maxUses = licenseKey.maxMonitoringUses;
        const remainingUses = maxUses - uses;
        const usesToBeUsed = Array.isArray(body) ? body.length : 1;
        if (remainingUses < usesToBeUsed) {
            throw new common_1.UnprocessableEntityException({
                message: 'Error deuto your maximum license usage count exceeded.',
                remainingUsages: remainingUses,
                usesToBeUsed: usesToBeUsed,
            });
        }
        return true;
    }
};
SubscribeRadioMonitorLicenseValidationGuard = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [licensekey_service_1.LicensekeyService])
], SubscribeRadioMonitorLicenseValidationGuard);
exports.SubscribeRadioMonitorLicenseValidationGuard = SubscribeRadioMonitorLicenseValidationGuard;
//# sourceMappingURL=license-validation.guard.js.map