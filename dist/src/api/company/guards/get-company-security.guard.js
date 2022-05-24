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
exports.GetCompanySecurityGuard = void 0;
const common_1 = require("@nestjs/common");
const common_2 = require("@nestjs/common");
const Enums_1 = require("../../../constants/Enums");
const company_service_1 = require("../company.service");
let GetCompanySecurityGuard = class GetCompanySecurityGuard {
    constructor(companyService) {
        this.companyService = companyService;
    }
    async canActivate(context) {
        var _a, _b, _c;
        const request = context.switchToHttp().getRequest();
        const companyId = (_a = request === null || request === void 0 ? void 0 : request.param) === null || _a === void 0 ? void 0 : _a.id;
        const loggedInUser = request === null || request === void 0 ? void 0 : request.user;
        switch (loggedInUser.userRole) {
            case Enums_1.SystemRoles.ADMIN:
                break;
            case Enums_1.SystemRoles.COMPANY_ADMIN:
            case Enums_1.SystemRoles.COMPANY_USER:
                if (companyId !== ((_b = loggedInUser === null || loggedInUser === void 0 ? void 0 : loggedInUser.company) === null || _b === void 0 ? void 0 : _b.id)) {
                    throw new common_2.ForbiddenException('Resource mismatch');
                }
                break;
            case Enums_1.SystemRoles.PARTNER_ADMIN:
                const partnerId = (_c = loggedInUser === null || loggedInUser === void 0 ? void 0 : loggedInUser.adminPartner) === null || _c === void 0 ? void 0 : _c.id;
                const company = await this.companyService.findOne({
                    _id: companyId,
                    partner: partnerId,
                });
                if (!company) {
                    throw new common_2.ForbiddenException('Resource mismatch');
                }
                break;
            default:
                throw new common_2.ForbiddenException('You dont have permission to do this action.');
        }
        return true;
    }
};
GetCompanySecurityGuard = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [company_service_1.CompanyService])
], GetCompanySecurityGuard);
exports.GetCompanySecurityGuard = GetCompanySecurityGuard;
//# sourceMappingURL=get-company-security.guard.js.map