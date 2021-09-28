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
exports.RoleBasedGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const Enums_1 = require("../../../constants/Enums");
const common_2 = require("@nestjs/common");
let RoleBasedGuard = class RoleBasedGuard {
    constructor(reflector) {
        this.reflector = reflector;
    }
    canActivate(context) {
        const roles = this.reflector.getAllAndMerge('roles', [
            context.getClass(),
            context.getHandler(),
        ]) || [];
        const isPublic = this.reflector.getAllAndOverride('public', [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!roles || isPublic) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const currentUser = request === null || request === void 0 ? void 0 : request.user;
        const userRoles = currentUser['cognito:groups'] || [];
        const isAllowed = this.matchRoles(roles, userRoles);
        if (!isAllowed) {
            throw new common_2.ForbiddenException("You dont have permission to do this.");
        }
        return true;
    }
    matchRoles(definedRoles, userRoles) {
        return userRoles.some((role) => definedRoles.includes(role));
    }
};
RoleBasedGuard = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [core_1.Reflector])
], RoleBasedGuard);
exports.RoleBasedGuard = RoleBasedGuard;
//# sourceMappingURL=role-based.guard.js.map