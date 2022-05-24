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
exports.UpdateUserSecurityGuard = void 0;
const common_1 = require("@nestjs/common");
const common_2 = require("@nestjs/common");
const Enums_1 = require("../../../constants/Enums");
const user_service_1 = require("../services/user.service");
const company_service_1 = require("../../company/company.service");
let UpdateUserSecurityGuard = class UpdateUserSecurityGuard {
    constructor(userService, companyService) {
        this.userService = userService;
        this.companyService = companyService;
    }
    async canActivate(context) {
        var _a, _b;
        const request = context.switchToHttp().getRequest();
        const loggedInUser = request === null || request === void 0 ? void 0 : request.user;
        const userId = (_a = request === null || request === void 0 ? void 0 : request.param) === null || _a === void 0 ? void 0 : _a.id;
        const updateUserDto = request === null || request === void 0 ? void 0 : request.body;
        if (userId == (loggedInUser === null || loggedInUser === void 0 ? void 0 : loggedInUser.sub)) {
            throw new common_1.UnprocessableEntityException('You can not update your own details using this endpoint');
        }
        switch (loggedInUser.userRole) {
            case Enums_1.SystemRoles.ADMIN:
                if (updateUserDto.partner) {
                    updateUserDto.userRole = Enums_1.SystemRoles.PARTNER_USER;
                }
                if (updateUserDto.company) {
                    updateUserDto.userRole = Enums_1.SystemRoles.COMPANY_USER;
                }
                break;
            case Enums_1.SystemRoles.PARTNER_ADMIN:
                delete updateUserDto.userRole;
                delete updateUserDto.partner;
                delete updateUserDto.password;
                if (updateUserDto.company) {
                    updateUserDto.userRole = Enums_1.SystemRoles.COMPANY_USER;
                }
                request.body = updateUserDto;
                break;
            case Enums_1.SystemRoles.COMPANY_ADMIN:
                const companyId = (_b = loggedInUser === null || loggedInUser === void 0 ? void 0 : loggedInUser.adminCompany) === null || _b === void 0 ? void 0 : _b.id;
                delete updateUserDto.userRole;
                delete updateUserDto.partner;
                delete updateUserDto.password;
                delete updateUserDto.company;
                request.body = updateUserDto;
                break;
            default:
                throw new common_2.ForbiddenException('You dont have permission to do this action.');
        }
        return true;
    }
};
UpdateUserSecurityGuard = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [user_service_1.UserService,
        company_service_1.CompanyService])
], UpdateUserSecurityGuard);
exports.UpdateUserSecurityGuard = UpdateUserSecurityGuard;
//# sourceMappingURL=update-user-security.guard.js.map