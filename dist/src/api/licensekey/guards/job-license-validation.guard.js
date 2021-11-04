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
exports.JobLicenseValidationGuard = void 0;
const common_1 = require("@nestjs/common");
const licensekey_service_1 = require("../services/licensekey.service");
let JobLicenseValidationGuard = class JobLicenseValidationGuard {
    constructor(licensekeyService) {
        this.licensekeyService = licensekeyService;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const body = request.body;
        const license = body.license || body.licenseId;
        if (!license || !body.owner || !body.jobFiles) {
            throw new common_1.BadRequestException({
                message: 'missing parameters',
            });
        }
        if (body.jobFiles.length < 0) {
            throw new common_1.BadRequestException({
                message: 'Please add some files to create job',
            });
        }
        const { validationResult, licenseKey } = await this.licensekeyService.validateLicence(license);
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
        const usesToBeUsed = body.jobFiles.length;
        const reserves = licenseKey.reserves || [];
        if (await this.isAllowedForJobCreation(remaniningUses, usesToBeUsed, reserves)) {
            request.validLicense = licenseKey;
            return true;
        }
        else {
            return false;
        }
    }
    async isAllowedForJobCreation(remaniningUses, usesToBeUsed, reserves) {
        var reservedLicenceCount = 0;
        if (reserves && Array.isArray(reserves)) {
            reservedLicenceCount = reserves.reduce((sum, { count }) => sum + count, 0);
        }
        const remaniningUsesAfterReservedCount = remaniningUses - reservedLicenceCount;
        if (remaniningUsesAfterReservedCount < usesToBeUsed) {
            throw new common_1.UnprocessableEntityException({
                message: 'Please create a job with minimum files as your maximum license usage count exceeded your file count.',
                remainingUsages: remaniningUses,
                reservedLicenceCount: reservedLicenceCount,
                remaniningUsesAfterReservedCount: remaniningUsesAfterReservedCount,
                usesToBeUsed: usesToBeUsed,
            });
        }
        return true;
    }
};
JobLicenseValidationGuard = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [licensekey_service_1.LicensekeyService])
], JobLicenseValidationGuard);
exports.JobLicenseValidationGuard = JobLicenseValidationGuard;
//# sourceMappingURL=job-license-validation.guard.js.map