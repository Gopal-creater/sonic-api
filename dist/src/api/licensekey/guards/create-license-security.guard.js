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
exports.CreateLicenseSecurityGuard = void 0;
const common_1 = require("@nestjs/common");
const Enums_1 = require("../../../constants/Enums");
const licensekey_service_1 = require("../services/licensekey.service");
let CreateLicenseSecurityGuard = class CreateLicenseSecurityGuard {
    constructor(trackService) {
        this.trackService = trackService;
    }
    async canActivate(context) {
        var _a, _b;
        const request = context.switchToHttp().getRequest();
        const loggedInUser = request === null || request === void 0 ? void 0 : request.user;
        const createLicensekeyDto = request === null || request === void 0 ? void 0 : request.body;
        switch (loggedInUser.userRole) {
            case Enums_1.SystemRoles.ADMIN:
            case Enums_1.Roles.THIRDPARTY_ADMIN:
                break;
            case Enums_1.SystemRoles.PARTNER_ADMIN:
                const partnerId = (_a = loggedInUser === null || loggedInUser === void 0 ? void 0 : loggedInUser.partner) === null || _a === void 0 ? void 0 : _a.id;
                if (createLicensekeyDto.type == Enums_1.ApiKeyType.INDIVIDUAL) {
                    if (!createLicensekeyDto.user) {
                        throw new common_1.BadRequestException('Please provide user in the request body');
                    }
                    delete createLicensekeyDto.company;
                }
                else if (createLicensekeyDto.type == Enums_1.ApiKeyType.COMPANY) {
                    if (!createLicensekeyDto.company) {
                        throw new common_1.BadRequestException('Please provide company in the request body');
                    }
                    delete createLicensekeyDto.user;
                }
                request.body = createLicensekeyDto;
                break;
            case Enums_1.SystemRoles.COMPANY_ADMIN:
                const companyId = (_b = loggedInUser === null || loggedInUser === void 0 ? void 0 : loggedInUser.company) === null || _b === void 0 ? void 0 : _b.id;
                if (!createLicensekeyDto.company) {
                    throw new common_1.BadRequestException('Please provide company id in the request body');
                }
                if (createLicensekeyDto.company !== companyId) {
                    throw new common_1.UnprocessableEntityException('Resource mismatch, Please provide your own company id');
                }
                if (createLicensekeyDto.type == Enums_1.ApiKeyType.INDIVIDUAL) {
                    if (!createLicensekeyDto.user) {
                        throw new common_1.BadRequestException('Please provide user in the request body');
                    }
                }
                else if (createLicensekeyDto.type == Enums_1.ApiKeyType.COMPANY) {
                }
                request.body = createLicensekeyDto;
                break;
            default:
                throw new common_1.ForbiddenException('You dont have permission to do this action.');
        }
        return true;
    }
};
CreateLicenseSecurityGuard = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [licensekey_service_1.LicensekeyService])
], CreateLicenseSecurityGuard);
exports.CreateLicenseSecurityGuard = CreateLicenseSecurityGuard;
//# sourceMappingURL=create-license-security.guard.js.map