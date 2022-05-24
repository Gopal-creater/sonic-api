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
exports.UpdatePartnerSecurityGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const common_2 = require("@nestjs/common");
const Enums_1 = require("../../../constants/Enums");
let UpdatePartnerSecurityGuard = class UpdatePartnerSecurityGuard {
    constructor(reflector) {
        this.reflector = reflector;
    }
    canActivate(context) {
        var _a, _b, _c;
        const request = context.switchToHttp().getRequest();
        const partnerId = (_a = request === null || request === void 0 ? void 0 : request.param) === null || _a === void 0 ? void 0 : _a.id;
        const loggedInUser = request === null || request === void 0 ? void 0 : request.user;
        switch (loggedInUser.userRole) {
            case Enums_1.SystemRoles.ADMIN:
                break;
            case Enums_1.SystemRoles.PARTNER_ADMIN:
                if (partnerId !== ((_b = loggedInUser === null || loggedInUser === void 0 ? void 0 : loggedInUser.adminPartner) === null || _b === void 0 ? void 0 : _b.id)) {
                    throw new common_2.ForbiddenException("You dont have permission to do this action, resource mismatch");
                }
                (_c = request === null || request === void 0 ? void 0 : request.body) === null || _c === void 0 ? true : delete _c.owner;
                break;
            default:
                throw new common_2.ForbiddenException("You dont have permission to do this action.");
        }
        return true;
    }
};
UpdatePartnerSecurityGuard = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [core_1.Reflector])
], UpdatePartnerSecurityGuard);
exports.UpdatePartnerSecurityGuard = UpdatePartnerSecurityGuard;
//# sourceMappingURL=update-partner-security.guard.js.map