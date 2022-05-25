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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscribeRadioMonitorLicenseValidationGuard = exports.GetSubscribedRadioMonitorListLicenseValidationGuard = exports.LicenseValidationGuard = void 0;
const common_1 = require("@nestjs/common");
const licensekey_schema_1 = require("../schemas/licensekey.schema");
const licensekey_service_1 = require("../services/licensekey.service");
const common_2 = require("@nestjs/common");
const Enums_1 = require("../../../constants/Enums");
let LicenseValidationGuard = class LicenseValidationGuard {
    constructor(licensekeyService) {
        this.licensekeyService = licensekeyService;
    }
    async canActivate(context) {
        var e_1, _a;
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        var licenses;
        licenses = await this.licensekeyService.findValidLicesesForUser(user.sub);
        if (!licenses || licenses.length <= 0) {
            throw new common_1.UnprocessableEntityException('No active license, please get atleast one to perform this action');
        }
        var currentValidLicense;
        var valid;
        var message;
        var remainingUses;
        var reservedLicenceCount;
        var remaniningUsesAfterReservedCount;
        var usesToBeUsed;
        var maxEncodeUses;
        var statusCode;
        try {
            for (var licenses_1 = __asyncValues(licenses), licenses_1_1; licenses_1_1 = await licenses_1.next(), !licenses_1_1.done;) {
                const license = licenses_1_1.value;
                const validationResults = await this.isValidLicenseForEncode(license.key);
                if (validationResults.valid) {
                    valid = true;
                    currentValidLicense = license;
                    break;
                }
                valid = false;
                statusCode = validationResults.statusCode || 422;
                message = validationResults.message || 'License validation failded';
                remainingUses = validationResults.remainingUses;
                reservedLicenceCount = validationResults.reservedLicenceCount;
                remaniningUsesAfterReservedCount =
                    validationResults.remaniningUsesAfterReservedCount;
                usesToBeUsed = validationResults.usesToBeUsed;
                maxEncodeUses = validationResults.maxEncodeUses;
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (licenses_1_1 && !licenses_1_1.done && (_a = licenses_1.return)) await _a.call(licenses_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        if (!valid) {
            throw new common_2.HttpException({
                valid: valid,
                message: message,
                remainingUses: remainingUses,
                reservedLicenceCount: reservedLicenceCount,
                remaniningUsesAfterReservedCount: remaniningUsesAfterReservedCount,
                usesToBeUsed: usesToBeUsed,
                maxEncodeUses: maxEncodeUses,
            }, statusCode);
        }
        request.validLicense = currentValidLicense;
        return Boolean(currentValidLicense);
    }
    async isValidLicenseForEncode(id) {
        const { validationResult, licenseKey, } = await this.licensekeyService.validateLicence(id);
        if (!validationResult.valid) {
            return {
                valid: false,
                message: validationResult.message,
                statusCode: 422,
                usesExceeded: false,
            };
        }
        if (licenseKey.isUnlimitedEncode) {
            return {
                valid: true,
            };
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
            return {
                valid: false,
                message: 'Error deuto your maximum license usage count exceeded.',
                statusCode: 422,
                usesExceeded: true,
                remainingUses: remainingUses,
                reservedLicenceCount: reservedLicenceCount,
                remaniningUsesAfterReservedCount: remaniningUsesAfterReservedCount,
                usesToBeUsed: usesToBeUsed,
                maxEncodeUses: maxUses,
            };
        }
        return {
            valid: true,
        };
    }
};
LicenseValidationGuard = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [licensekey_service_1.LicensekeyService])
], LicenseValidationGuard);
exports.LicenseValidationGuard = LicenseValidationGuard;
let GetSubscribedRadioMonitorListLicenseValidationGuard = class GetSubscribedRadioMonitorListLicenseValidationGuard {
    constructor(licensekeyService) {
        this.licensekeyService = licensekeyService;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        const validLicenseForMonitor = await this.licensekeyService.findPreferedLicenseToGetRadioMonitoringListFor(user.sub);
        if (!validLicenseForMonitor) {
            throw new common_1.UnprocessableEntityException('No valid monitoring license found!');
        }
        request.validLicense = validLicenseForMonitor;
        return Boolean(validLicenseForMonitor);
    }
};
GetSubscribedRadioMonitorListLicenseValidationGuard = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [licensekey_service_1.LicensekeyService])
], GetSubscribedRadioMonitorListLicenseValidationGuard);
exports.GetSubscribedRadioMonitorListLicenseValidationGuard = GetSubscribedRadioMonitorListLicenseValidationGuard;
let SubscribeRadioMonitorLicenseValidationGuard = class SubscribeRadioMonitorLicenseValidationGuard {
    constructor(licensekeyService) {
        this.licensekeyService = licensekeyService;
    }
    async canActivate(context) {
        var e_2, _a;
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        const licenses = await this.licensekeyService.licenseKeyModel.find({
            'users': user.sub,
        });
        if (!licenses || licenses.length <= 0) {
            throw new common_1.UnprocessableEntityException('No License keys present. Please add a license key to subscribe for monitor.');
        }
        var currentValidLicense;
        var valid;
        var message;
        var remainingUses;
        var usesToBeUsed;
        var maxMonitoringUses;
        var statusCode;
        try {
            for (var licenses_2 = __asyncValues(licenses), licenses_2_1; licenses_2_1 = await licenses_2.next(), !licenses_2_1.done;) {
                const license = licenses_2_1.value;
                const validationResults = await this.isValidLicenseForMonitor(license.key, request.body);
                if (validationResults.valid) {
                    valid = true;
                    currentValidLicense = license;
                    break;
                }
                valid = false;
                statusCode = validationResults.statusCode || 422;
                message = validationResults.message || 'License validation failded';
                remainingUses = validationResults.remainingUses;
                usesToBeUsed = validationResults.usesToBeUsed;
                maxMonitoringUses = validationResults.maxMonitoringUses;
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (licenses_2_1 && !licenses_2_1.done && (_a = licenses_2.return)) await _a.call(licenses_2);
            }
            finally { if (e_2) throw e_2.error; }
        }
        if (!valid) {
            throw new common_2.HttpException({
                valid: valid,
                message: message,
                remainingUses: remainingUses,
                usesToBeUsed: usesToBeUsed,
                maxMonitoringUses: maxMonitoringUses,
            }, statusCode);
        }
        request.validLicense = currentValidLicense;
        return Boolean(currentValidLicense);
    }
    async isValidLicenseForMonitor(id, body) {
        const { validationResult, licenseKey, } = await this.licensekeyService.validateLicence(id);
        if (!validationResult.valid) {
            return {
                valid: false,
                message: validationResult.message,
                statusCode: 422,
                usesExceeded: false,
            };
        }
        if (licenseKey.isUnlimitedMonitor) {
            return {
                valid: true,
            };
        }
        const uses = licenseKey.monitoringUses;
        const maxUses = licenseKey.maxMonitoringUses;
        const remainingUses = maxUses - uses;
        const usesToBeUsed = Array.isArray(body) ? body.length : 1;
        if (remainingUses < usesToBeUsed) {
            return {
                valid: false,
                message: 'Error deuto your maximum license usage count exceeded.',
                statusCode: 422,
                usesExceeded: true,
                remainingUses: remainingUses,
                usesToBeUsed: usesToBeUsed,
                maxMonitoringUses: maxUses,
            };
        }
        return {
            valid: true,
        };
    }
};
SubscribeRadioMonitorLicenseValidationGuard = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [licensekey_service_1.LicensekeyService])
], SubscribeRadioMonitorLicenseValidationGuard);
exports.SubscribeRadioMonitorLicenseValidationGuard = SubscribeRadioMonitorLicenseValidationGuard;
//# sourceMappingURL=license-validation.guard.js.map