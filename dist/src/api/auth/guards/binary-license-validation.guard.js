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
const keygen_service_1 = require("../../../shared/modules/keygen/keygen.service");
const utils_1 = require("../../../shared/utils");
let BinaryLicenseValidationGuard = class BinaryLicenseValidationGuard {
    constructor(keygenService) {
        this.keygenService = keygenService;
    }
    async canActivate(context) {
        var _a, _b;
        const request = context.switchToHttp().getRequest();
        const body = request.body;
        if (!body.license || !body.sonicKey) {
            throw new common_1.BadRequestException({
                message: 'missing parameters',
            });
        }
        const { meta, data, errors } = await this.keygenService.validateLicence(body.license);
        if (errors || !meta['valid']) {
            throw new common_1.BadRequestException({
                message: 'Invalid license.',
            });
        }
        const uses = data['attributes']['uses'];
        const maxUses = data['attributes']['maxUses'];
        const remaniningUses = maxUses - uses;
        const reserves = utils_1.JSONUtils.parse((_b = (_a = data === null || data === void 0 ? void 0 : data.attributes) === null || _a === void 0 ? void 0 : _a.metadata) === null || _b === void 0 ? void 0 : _b.reserves, []);
        if (await this.isAllowedForJobCreation(remaniningUses, reserves)) {
            request.validLicense = data;
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
                remaniningUsesAfterReservedCount: remaniningUsesAfterReservedCount
            });
        }
        return true;
    }
};
BinaryLicenseValidationGuard = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [keygen_service_1.KeygenService])
], BinaryLicenseValidationGuard);
exports.BinaryLicenseValidationGuard = BinaryLicenseValidationGuard;
//# sourceMappingURL=binary-license-validation.guard.js.map