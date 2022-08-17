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
exports.ChangeUserPasswordSecurityGuard = void 0;
const common_1 = require("@nestjs/common");
const common_2 = require("@nestjs/common");
const Enums_1 = require("../../../constants/Enums");
const user_service_1 = require("../services/user.service");
const company_service_1 = require("../../company/company.service");
const mongoose_utils_1 = require("../../../shared/utils/mongoose.utils");
let ChangeUserPasswordSecurityGuard = class ChangeUserPasswordSecurityGuard {
    constructor(userService, companyService) {
        this.userService = userService;
        this.companyService = companyService;
    }
    async canActivate(context) {
        var _a, _b, _c, _d, _e;
        const request = context.switchToHttp().getRequest();
        const loggedInUser = request === null || request === void 0 ? void 0 : request.user;
        const userId = (_a = request === null || request === void 0 ? void 0 : request.params) === null || _a === void 0 ? void 0 : _a.id;
        console.log("userId", userId);
        if (userId == (loggedInUser === null || loggedInUser === void 0 ? void 0 : loggedInUser.sub)) {
            throw new common_1.UnprocessableEntityException('You can not change your own password using this endpoint');
        }
        switch (loggedInUser.userRole) {
            case Enums_1.SystemRoles.ADMIN:
                break;
            case Enums_1.SystemRoles.PARTNER_ADMIN:
                const partnerId = (_b = loggedInUser === null || loggedInUser === void 0 ? void 0 : loggedInUser.adminPartner) === null || _b === void 0 ? void 0 : _b.id;
                const userFromDb = await this.userService.getUserProfile(userId);
                console.log("partnerId", partnerId);
                console.log("userFromDb?.partner?.id", (_c = userFromDb === null || userFromDb === void 0 ? void 0 : userFromDb.partner) === null || _c === void 0 ? void 0 : _c.id);
                if (!userFromDb) {
                    throw new common_1.NotFoundException('User not found db');
                }
                if (userFromDb.userRole !== Enums_1.SystemRoles.PARTNER_USER && userFromDb.userRole !== Enums_1.SystemRoles.COMPANY_USER) {
                    throw new common_1.UnprocessableEntityException('User can not be modified');
                }
                if (userFromDb.userRole == Enums_1.SystemRoles.PARTNER_USER) {
                    if (((_d = userFromDb === null || userFromDb === void 0 ? void 0 : userFromDb.partner) === null || _d === void 0 ? void 0 : _d.id) !== partnerId) {
                        throw new common_1.NotFoundException('User not found cond');
                    }
                }
                if (userFromDb.userRole == Enums_1.SystemRoles.COMPANY_USER) {
                    const isOwnUser = await this.userService.findOneAggregate({
                        filter: {
                            _id: userId
                        },
                        relationalFilter: {
                            'company.partner': (0, mongoose_utils_1.toObjectId)(partnerId)
                        }
                    });
                    if (!isOwnUser) {
                        throw new common_1.NotFoundException('User not found');
                    }
                }
                break;
            case Enums_1.SystemRoles.COMPANY_ADMIN:
                const companyId = (_e = loggedInUser === null || loggedInUser === void 0 ? void 0 : loggedInUser.adminCompany) === null || _e === void 0 ? void 0 : _e.id;
                const userFromDatabase = await this.userService.findOne({
                    _id: userId,
                    'company': (0, mongoose_utils_1.toObjectId)(companyId)
                });
                if (!userFromDatabase) {
                    throw new common_1.NotFoundException('User not found');
                }
                if (userFromDb.userRole !== Enums_1.SystemRoles.COMPANY_USER) {
                    throw new common_1.UnprocessableEntityException('User can not be modified');
                }
                break;
            default:
                throw new common_2.ForbiddenException('You dont have permission to do this action.');
        }
        return true;
    }
};
ChangeUserPasswordSecurityGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService,
        company_service_1.CompanyService])
], ChangeUserPasswordSecurityGuard);
exports.ChangeUserPasswordSecurityGuard = ChangeUserPasswordSecurityGuard;
//# sourceMappingURL=change-user-password-security.guard%20copy.js.map