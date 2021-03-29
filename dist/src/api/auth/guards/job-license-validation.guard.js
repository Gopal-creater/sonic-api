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
const keygen_service_1 = require("../../../shared/modules/keygen/keygen.service");
const utils_1 = require("../../../shared/utils");
let JobLicenseValidationGuard = class JobLicenseValidationGuard {
    constructor(keygenService) {
        this.keygenService = keygenService;
    }
    async canActivate(context) {
        var _a, _b, _c, _d;
        const request = context.switchToHttp().getRequest();
        const body = request.body;
        if (!body.licenseId || !body.owner || !body.jobDetails) {
            throw new common_1.BadRequestException({
                message: 'missing parameters',
            });
        }
        if (body.jobDetails.length < 0) {
            throw new common_1.BadRequestException({
                message: 'Please add some files to create job',
            });
        }
        const { meta, data, errors } = await this.keygenService.validateLicence(body.licenseId);
        if (errors || !meta['valid']) {
            throw new common_1.BadRequestException({
                message: 'Invalid license.',
            });
        }
        if (((_b = (_a = data === null || data === void 0 ? void 0 : data.attributes) === null || _a === void 0 ? void 0 : _a.metadata) === null || _b === void 0 ? void 0 : _b.ownerId) !== body.owner) {
            throw new common_1.BadRequestException({
                message: 'Looks like the provided licence id is not belongs to you.',
            });
        }
        const uses = data['attributes']['uses'];
        const maxUses = data['attributes']['maxUses'];
        const remaniningUses = maxUses - uses;
        const usesToBeUsed = body.jobDetails.length;
        const reserves = utils_1.JSONUtils.parse((_d = (_c = data === null || data === void 0 ? void 0 : data.attributes) === null || _c === void 0 ? void 0 : _c.metadata) === null || _d === void 0 ? void 0 : _d.reserves, []);
        if (await this.isAllowedForJobCreation(remaniningUses, usesToBeUsed, reserves)) {
            request.validLicense = data;
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
    __metadata("design:paramtypes", [keygen_service_1.KeygenService])
], JobLicenseValidationGuard);
exports.JobLicenseValidationGuard = JobLicenseValidationGuard;
//# sourceMappingURL=job-license-validation.guard.js.map