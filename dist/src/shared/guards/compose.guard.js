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
exports.ComposeGuard = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../api/auth/guards/jwt-auth.guard");
const apikey_auth_guard_1 = require("../../api/api-key/guards/apikey-auth.guard");
let ComposeGuard = class ComposeGuard {
    constructor(jwtAuthGuard, apiKeyAuthGuard) {
        this.jwtAuthGuard = jwtAuthGuard;
        this.apiKeyAuthGuard = apiKeyAuthGuard;
    }
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const xApikey = request.headers['x-api-key'];
        console.log('x-api-key', xApikey);
        if (xApikey) {
            return this.apiKeyAuthGuard.canActivate(context);
        }
        else {
            return this.jwtAuthGuard.canActivate(context);
        }
    }
};
ComposeGuard = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [jwt_auth_guard_1.JwtAuthGuard,
        apikey_auth_guard_1.ApiKeyAuthGuard])
], ComposeGuard);
exports.ComposeGuard = ComposeGuard;
//# sourceMappingURL=compose.guard.js.map