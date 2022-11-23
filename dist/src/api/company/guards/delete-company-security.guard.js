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
exports.DeleteCompanySecurityGuard = void 0;
const common_1 = require("@nestjs/common");
const common_2 = require("@nestjs/common");
const Enums_1 = require("../../../constants/Enums");
const company_service_1 = require("../company.service");
let DeleteCompanySecurityGuard = class DeleteCompanySecurityGuard {
    constructor(companyService) {
        this.companyService = companyService;
    }
    async canActivate(context) {
        var _a, _b;
        const request = context.switchToHttp().getRequest();
        const companyId = (_a = request === null || request === void 0 ? void 0 : request.params) === null || _a === void 0 ? void 0 : _a.id;
        const loggedInUser = request === null || request === void 0 ? void 0 : request.user;
        switch (loggedInUser.userRole) {
            case Enums_1.SystemRoles.ADMIN:
                break;
            case Enums_1.SystemRoles.PARTNER_ADMIN:
                const partnerId = (_b = loggedInUser === null || loggedInUser === void 0 ? void 0 : loggedInUser.adminPartner) === null || _b === void 0 ? void 0 : _b.id;
                const company = await this.companyService.findOne({ _id: companyId, partner: partnerId });
                if (!company) {
                    throw new common_1.NotFoundException("Resource not found");
                }
                break;
            default:
                throw new common_2.ForbiddenException("You dont have permission to do this action.");
        }
        return true;
    }
};
DeleteCompanySecurityGuard = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [company_service_1.CompanyService])
], DeleteCompanySecurityGuard);
exports.DeleteCompanySecurityGuard = DeleteCompanySecurityGuard;
//# sourceMappingURL=delete-company-security.guard.js.map