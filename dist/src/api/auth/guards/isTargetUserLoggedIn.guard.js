"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsTargetUserLoggedInGuard = void 0;
const common_1 = require("@nestjs/common");
let IsTargetUserLoggedInGuard = class IsTargetUserLoggedInGuard {
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        if (request.user) {
            if (!request.query.user) {
                throw new common_1.UnauthorizedException('Specify target user equal to your own id. eg: ?user=yourId');
            }
            const loggedInUser = request.user;
            const targetUser = request.query.user;
            if (targetUser == loggedInUser['sub']) {
                return true;
            }
            else {
                throw new common_1.UnauthorizedException('Target user is different from loggedIn User');
            }
        }
        throw new common_1.UnauthorizedException('You are not loggedIn');
    }
};
IsTargetUserLoggedInGuard = __decorate([
    common_1.Injectable()
], IsTargetUserLoggedInGuard);
exports.IsTargetUserLoggedInGuard = IsTargetUserLoggedInGuard;
//# sourceMappingURL=isTargetUserLoggedIn.guard.js.map