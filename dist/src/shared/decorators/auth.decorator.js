"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Auth = void 0;
const role_based_guard_1 = require("./../../api/auth/guards/role-based.guard");
const roles_decorator_1 = require("./roles.decorator");
const passport_1 = require("@nestjs/passport");
const common_1 = require("@nestjs/common");
function Auth(rules = { additionalGuards: [], roles: [] }) {
    const { additionalGuards, roles } = rules;
    return common_1.applyDecorators(roles_decorator_1.Roles(roles), common_1.UseGuards(passport_1.AuthGuard('jwt'), role_based_guard_1.RoleBasedGuard, ...additionalGuards));
}
exports.Auth = Auth;
//# sourceMappingURL=auth.decorator.js.map