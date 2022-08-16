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
exports.CreateCompanySecurityGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const common_2 = require("@nestjs/common");
const Enums_1 = require("../../../constants/Enums");
let CreateCompanySecurityGuard = class CreateCompanySecurityGuard {
    constructor(reflector) {
        this.reflector = reflector;
    }
    canActivate(context) {
        var _a;
        const request = context.switchToHttp().getRequest();
        const createCompanyDto = request === null || request === void 0 ? void 0 : request.body;
        const loggedInUser = request === null || request === void 0 ? void 0 : request.user;
        switch (loggedInUser.userRole) {
            case Enums_1.SystemRoles.ADMIN:
                break;
            case Enums_1.SystemRoles.PARTNER_ADMIN:
                if (!(createCompanyDto === null || createCompanyDto === void 0 ? void 0 : createCompanyDto.partner)) {
                    throw new common_1.BadRequestException('Please provide your partner id');
                }
                if ((createCompanyDto === null || createCompanyDto === void 0 ? void 0 : createCompanyDto.partner) !== ((_a = loggedInUser === null || loggedInUser === void 0 ? void 0 : loggedInUser.adminPartner) === null || _a === void 0 ? void 0 : _a.id)) {
                    throw new common_2.ForbiddenException('You dont have permission to do this action, resource mismatch');
                }
                if (!(createCompanyDto === null || createCompanyDto === void 0 ? void 0 : createCompanyDto.owner)) {
                    throw new common_1.BadRequestException('Please provide owner id in request body');
                }
                break;
            default:
                throw new common_2.ForbiddenException('You dont have permission to do this action.');
        }
        return true;
    }
};
CreateCompanySecurityGuard = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [core_1.Reflector])
], CreateCompanySecurityGuard);
exports.CreateCompanySecurityGuard = CreateCompanySecurityGuard;
//# sourceMappingURL=create-company.guard.js.map