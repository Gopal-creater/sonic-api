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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_service_1 = require("./auth.service");
const login_dto_1 = require("./dto/login.dto");
const register_dto_1 = require("./dto/register.dto");
const user_service_1 = require("../user/services/user.service");
const partner_service_1 = require("../partner/services/partner.service");
let AuthController = class AuthController {
    constructor(authService, userService, partnerService) {
        this.authService = authService;
        this.userService = userService;
        this.partnerService = partnerService;
    }
    async login(loginDto) {
        const { userName, password } = loginDto;
        return this.authService.login(userName, password);
    }
    async wpmsSignup(wpmsUserRegisterDTO) {
        const { userName, email } = wpmsUserRegisterDTO;
        const userFromUsername = await this.userService.findOne({
            $or: [{ username: userName }, { email: email }],
        });
        if (userFromUsername) {
            throw new common_1.BadRequestException('User with given email or username already exists!');
        }
        return this.authService.signupWpmsUser(wpmsUserRegisterDTO);
    }
};
__decorate([
    (0, common_1.Post)('login'),
    (0, swagger_1.ApiOperation)({ summary: 'User Login' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('/wpms/signup'),
    (0, swagger_1.ApiOperation)({ summary: 'User Signup from WPMS website under WPMS Partner' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_dto_1.WpmsUserRegisterDTO]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "wpmsSignup", null);
AuthController = __decorate([
    (0, swagger_1.ApiTags)('Authentication Controller (D & M May 2022)'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        user_service_1.UserService,
        partner_service_1.PartnerService])
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map