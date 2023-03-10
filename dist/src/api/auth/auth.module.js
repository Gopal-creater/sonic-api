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
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const auth_config_1 = require("./config/auth.config");
const auth_service_1 = require("./auth.service");
const auth_controller_1 = require("./auth.controller");
const passport_1 = require("@nestjs/passport");
const jwt_strategy_1 = require("./strategies/jwt.strategy");
const api_key_module_1 = require("../api-key/api-key.module");
const licensekey_module_1 = require("../licensekey/licensekey.module");
const user_module_1 = require("../user/user.module");
const jwt_auth_guard_1 = require("./guards/jwt-auth.guard");
const apikey_auth_guard_1 = require("./guards/apikey-auth.guard");
const company_module_1 = require("../company/company.module");
const partner_module_1 = require("../partner/partner.module");
let AuthModule = class AuthModule {
    constructor(authService) {
        this.authService = authService;
    }
    onModuleInit() {
        this.authService.createSonicAdmin();
    }
};
AuthModule = __decorate([
    common_1.Module({
        imports: [
            passport_1.PassportModule.register({ defaultStrategy: 'jwt' }),
            api_key_module_1.ApiKeyModule,
            licensekey_module_1.LicensekeyModule,
            user_module_1.UserModule,
            company_module_1.CompanyModule,
            partner_module_1.PartnerModule
        ],
        providers: [
            auth_config_1.AuthConfig,
            auth_service_1.AuthService,
            jwt_strategy_1.JwtStrategy,
            jwt_auth_guard_1.JwtAuthGuard,
            apikey_auth_guard_1.ApiKeyAuthGuard,
        ],
        controllers: [auth_controller_1.AuthController],
        exports: [jwt_auth_guard_1.JwtAuthGuard, apikey_auth_guard_1.ApiKeyAuthGuard, company_module_1.CompanyModule, api_key_module_1.ApiKeyModule],
    }),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthModule);
exports.AuthModule = AuthModule;
//# sourceMappingURL=auth.module.js.map