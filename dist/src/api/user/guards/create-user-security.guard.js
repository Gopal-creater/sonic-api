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
exports.CreateUserSecurityGuard = void 0;
const common_1 = require("@nestjs/common");
const common_2 = require("@nestjs/common");
const Enums_1 = require("../../../constants/Enums");
const user_service_1 = require("../services/user.service");
const company_service_1 = require("../../company/company.service");
let CreateUserSecurityGuard = class CreateUserSecurityGuard {
    constructor(userService, companyService) {
        this.userService = userService;
        this.companyService = companyService;
    }
    async canActivate(context) {
        var _a, _b;
        const request = context.switchToHttp().getRequest();
        const loggedInUser = request === null || request === void 0 ? void 0 : request.user;
        const createUserDto = request === null || request === void 0 ? void 0 : request.body;
        switch (loggedInUser.userRole) {
            case Enums_1.SystemRoles.ADMIN:
                break;
            case Enums_1.SystemRoles.PARTNER_ADMIN:
                const partnerId = (_a = loggedInUser === null || loggedInUser === void 0 ? void 0 : loggedInUser.adminPartner) === null || _a === void 0 ? void 0 : _a._id;
                if (!createUserDto.partner && !createUserDto.company) {
                    throw new common_1.UnprocessableEntityException('Please provide at least one partner or company for this user');
                }
                if (createUserDto.partner) {
                    if (createUserDto.partner !== partnerId) {
                        throw new common_2.ForbiddenException('Resource mismatch, Provide your own partner id');
                    }
                    createUserDto.userRole = Enums_1.SystemRoles.PARTNER_USER;
                }
                if (createUserDto.company) {
                    const companyFromDb = await this.companyService.findOne({
                        _id: createUserDto.company,
                        partner: partnerId,
                    });
                    if (!companyFromDb)
                        throw new common_1.NotFoundException('Unknown company');
                    createUserDto.userRole = Enums_1.SystemRoles.COMPANY_USER;
                }
                break;
            case Enums_1.SystemRoles.COMPANY_ADMIN:
                const companyId = (_b = loggedInUser === null || loggedInUser === void 0 ? void 0 : loggedInUser.adminCompany) === null || _b === void 0 ? void 0 : _b._id;
                if (!createUserDto.company) {
                    throw new common_1.UnprocessableEntityException('Please provide your company id for this user');
                }
                if (createUserDto.company !== companyId) {
                    throw new common_2.ForbiddenException('Resource mismatch, Provide your own company id');
                }
                createUserDto.userRole = Enums_1.SystemRoles.COMPANY_USER;
                break;
            default:
                throw new common_2.ForbiddenException('You dont have permission to do this action.');
        }
        return true;
    }
};
CreateUserSecurityGuard = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [user_service_1.UserService,
        company_service_1.CompanyService])
], CreateUserSecurityGuard);
exports.CreateUserSecurityGuard = CreateUserSecurityGuard;
//# sourceMappingURL=create-user-security.guard.js.map