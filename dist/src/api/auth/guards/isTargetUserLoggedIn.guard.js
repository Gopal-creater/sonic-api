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
exports.IsTargetUserLoggedInGuard = void 0;
const common_1 = require("@nestjs/common");
let IsTargetUserLoggedInGuard = class IsTargetUserLoggedInGuard {
    constructor(target = 'Query', name = "targetUser") {
        this.target = target;
        this.name = name;
    }
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        switch (this.target) {
            case 'Query':
                const query = request.query;
                if (request.user) {
                    if (!query[this.name]) {
                        throw new common_1.UnauthorizedException(`Specify target user equal to your own id. eg: ?${this.name}=yourId`);
                    }
                    const loggedInUser = request.user;
                    const targetUser = query[this.name];
                    if (targetUser == loggedInUser.sub) {
                        delete query.targetUser;
                        request.query = query;
                        return true;
                    }
                    else {
                        throw new common_1.UnauthorizedException('Target user is different from loggedIn User');
                    }
                }
                throw new common_1.UnauthorizedException('You are not loggedIn');
            case 'Param':
                const param = request.params;
                if (request.user) {
                    if (!param[this.name]) {
                        throw new common_1.UnauthorizedException(`Specify target user equal to your own id. eg: {${this.name}}=yourId`);
                    }
                    const loggedInUser = request.user;
                    const targetUser = param[this.name];
                    if (targetUser == loggedInUser['sub']) {
                        return true;
                    }
                    else {
                        throw new common_1.UnauthorizedException('Target user is different from loggedIn User');
                    }
                }
                throw new common_1.UnauthorizedException('You are not loggedIn');
        }
    }
};
IsTargetUserLoggedInGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [String, String])
], IsTargetUserLoggedInGuard);
exports.IsTargetUserLoggedInGuard = IsTargetUserLoggedInGuard;
//# sourceMappingURL=isTargetUserLoggedIn.guard.js.map