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
exports.BulkEncodeWithQueueLicenseValidationGuard = exports.JobLicenseValidationGuard = void 0;
const common_1 = require("@nestjs/common");
const api_key_schema_1 = require("../../api-key/schemas/api-key.schema");
const encode_dto_1 = require("../../sonickey/dtos/encode.dto");
const Enums_1 = require("../../../constants/Enums");
const licensekey_service_1 = require("../services/licensekey.service");
let JobLicenseValidationGuard = class JobLicenseValidationGuard {
    constructor(licensekeyService) {
        this.licensekeyService = licensekeyService;
    }
    async canActivate(context) {
        var _a;
        const request = context.switchToHttp().getRequest();
        const body = request.body;
        const owner = body.owner || ((_a = request === null || request === void 0 ? void 0 : request.user) === null || _a === void 0 ? void 0 : _a['sub']);
        if (!body.license || !owner || !body.jobFiles) {
            throw new common_1.BadRequestException({
                message: 'missing parameters',
            });
        }
        if (body.jobFiles.length < 0) {
            throw new common_1.BadRequestException({
                message: 'Please add some files to create job',
            });
        }
        const { validationResult, licenseKey, } = await this.licensekeyService.validateLicence(body.license);
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
let BulkEncodeWithQueueLicenseValidationGuard = class BulkEncodeWithQueueLicenseValidationGuard {
    constructor(licensekeyService) {
        this.licensekeyService = licensekeyService;
    }
    async canActivate(context) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        const request = context.switchToHttp().getRequest();
        const body = request.body;
        const companyId = (_a = request === null || request === void 0 ? void 0 : request.params) === null || _a === void 0 ? void 0 : _a.companyId;
        const apikey = request === null || request === void 0 ? void 0 : request['apikey'];
        if (apikey.type !== Enums_1.ApiKeyType.COMPANY) {
            throw new common_1.BadRequestException({
                message: 'Given apikey is not a company type apikey, you must used company apikey here.',
            });
        }
        if (((_d = (_c = (_b = apikey === null || apikey === void 0 ? void 0 : apikey.company) === null || _b === void 0 ? void 0 : _b._id) === null || _c === void 0 ? void 0 : _c.toString) === null || _d === void 0 ? void 0 : _d.call(_c)) !== companyId) {
            throw new common_1.BadRequestException({
                message: 'Given apikey is not own by given company, please use your own apikey',
            });
        }
        console.log('companyId', companyId);
        if (((_e = body.fileSpecs) === null || _e === void 0 ? void 0 : _e.length) < 0) {
            throw new common_1.BadRequestException({
                message: 'Please add at least one fileSpecs to create queue',
            });
        }
        const { validationResult, licenseKey, } = await this.licensekeyService.validateLicence(body.license);
        if (!validationResult.valid) {
            throw new common_1.BadRequestException({
                message: 'Invalid license.',
            });
        }
        if (!licenseKey.company) {
            throw new common_1.BadRequestException({
                message: 'Given license is not a company type license, you must used company license here.',
            });
        }
        if (companyId !== ((_h = (_g = (_f = licenseKey === null || licenseKey === void 0 ? void 0 : licenseKey.company) === null || _f === void 0 ? void 0 : _f._id) === null || _g === void 0 ? void 0 : _g.toString) === null || _h === void 0 ? void 0 : _h.call(_g))) {
            throw new common_1.BadRequestException({
                message: 'Given license is not own by given company, please use your own license',
            });
        }
        if (licenseKey.isUnlimitedEncode) {
            request.validLicense = licenseKey;
            return true;
        }
        const uses = licenseKey.encodeUses;
        const maxUses = licenseKey.maxEncodeUses;
        const remaniningUses = maxUses - uses;
        const usesToBeUsed = body.fileSpecs.length;
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
BulkEncodeWithQueueLicenseValidationGuard = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [licensekey_service_1.LicensekeyService])
], BulkEncodeWithQueueLicenseValidationGuard);
exports.BulkEncodeWithQueueLicenseValidationGuard = BulkEncodeWithQueueLicenseValidationGuard;
//# sourceMappingURL=job-license-validation.guard.js.map