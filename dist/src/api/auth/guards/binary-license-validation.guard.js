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
exports.BinaryLicenseValidationGuard = void 0;
const common_1 = require("@nestjs/common");
const licensekey_service_1 = require("../../licensekey/services/licensekey.service");
let BinaryLicenseValidationGuard = class BinaryLicenseValidationGuard {
    constructor(licensekeyService) {
        this.licensekeyService = licensekeyService;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const body = request.body;
        if (!body.license || !body.sonicKey) {
            throw new common_1.BadRequestException({
                message: 'missing parameters',
            });
        }
        const { validationResult, licenseKey } = await this.licensekeyService.validateLicence(body.license);
        if (!validationResult.valid) {
            throw new common_1.BadRequestException({
                message: 'Invalid license.',
            });
        }
        if (licenseKey.isUnlimitedEncode) {
            request.validLicense = licenseKey;
            return true;
        }
        const uses = licenseKey.encodeUses;
        const maxUses = licenseKey.maxEncodeUses;
        const remaniningUses = maxUses - uses;
        const reserves = licenseKey.reserves || [];
        if (await this.isAllowedForJobCreation(remaniningUses, reserves)) {
            request.validLicense = licenseKey;
            return true;
        }
        else {
            return false;
        }
    }
    async isAllowedForJobCreation(remaniningUses, reserves) {
        var reservedLicenceCount = 0;
        if (reserves && Array.isArray(reserves)) {
            reservedLicenceCount = reserves.reduce((sum, { count }) => sum + count, 0);
        }
        const remaniningUsesAfterReservedCount = remaniningUses - reservedLicenceCount;
        if (remaniningUsesAfterReservedCount <= 0) {
            throw new common_1.UnprocessableEntityException({
                message: 'Maximum license usage count exceeded.',
                remainingUsages: remaniningUses,
                reservedLicenceCount: reservedLicenceCount,
                remaniningUsesAfterReservedCount: remaniningUsesAfterReservedCount,
            });
        }
        return true;
    }
};
BinaryLicenseValidationGuard = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [licensekey_service_1.LicensekeyService])
], BinaryLicenseValidationGuard);
exports.BinaryLicenseValidationGuard = BinaryLicenseValidationGuard;
//# sourceMappingURL=binary-license-validation.guard.js.map