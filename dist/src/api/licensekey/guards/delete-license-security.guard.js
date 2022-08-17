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
exports.DeleteLicenseSecurityGuard = void 0;
const common_1 = require("@nestjs/common");
const Enums_1 = require("../../../constants/Enums");
const licensekey_service_1 = require("../services/licensekey.service");
let DeleteLicenseSecurityGuard = class DeleteLicenseSecurityGuard {
    constructor(licensekeyService) {
        this.licensekeyService = licensekeyService;
    }
    async canActivate(context) {
        var _a, _b, _c;
        const request = context.switchToHttp().getRequest();
        const loggedInUser = request === null || request === void 0 ? void 0 : request.user;
        const licenseKeyId = (_a = request === null || request === void 0 ? void 0 : request.params) === null || _a === void 0 ? void 0 : _a.id;
        switch (loggedInUser.userRole) {
            case Enums_1.SystemRoles.ADMIN:
            case Enums_1.Roles.THIRDPARTY_ADMIN:
                break;
            case Enums_1.SystemRoles.PARTNER_ADMIN:
                const partnerId = (_b = loggedInUser === null || loggedInUser === void 0 ? void 0 : loggedInUser.partner) === null || _b === void 0 ? void 0 : _b._id;
                const licenseKey = await this.licensekeyService.findOneAggregate({
                    filter: {},
                    relationalFilter: {
                        $or: [
                            { 'users.partner': partnerId },
                            { 'company.partner': partnerId },
                        ],
                    },
                });
                if (!licenseKey) {
                    throw new common_1.NotFoundException();
                }
                break;
            case Enums_1.SystemRoles.COMPANY_ADMIN:
                const companyId = (_c = loggedInUser === null || loggedInUser === void 0 ? void 0 : loggedInUser.company) === null || _c === void 0 ? void 0 : _c.id;
                const licenseKeyFromdb = await this.licensekeyService.findOne({
                    _id: licenseKeyId,
                    company: companyId,
                });
                if (!licenseKeyFromdb) {
                    throw new common_1.NotFoundException();
                }
                break;
            default:
                throw new common_1.ForbiddenException('You dont have permission to do this action.');
        }
        return true;
    }
};
DeleteLicenseSecurityGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [licensekey_service_1.LicensekeyService])
], DeleteLicenseSecurityGuard);
exports.DeleteLicenseSecurityGuard = DeleteLicenseSecurityGuard;
//# sourceMappingURL=delete-license-security.guard.js.map