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
exports.UserController = void 0;
const openapi = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("./../auth/guards/jwt-auth.guard");
const swagger_1 = require("@nestjs/swagger");
const index_1 = require("./dtos/index");
const user_service_1 = require("./user.service");
const common_1 = require("@nestjs/common");
let UserController = class UserController {
    constructor(userServices) {
        this.userServices = userServices;
    }
    async getUserLicenses(userId) {
        return this.userServices.listAllLicensesOfOwner(userId);
    }
    async addNewLicense(userId, addNewLicenseDto) {
        return this.userServices.addNewLicense(addNewLicenseDto.licenseKey, userId).catch(err => {
            if (err.status == 404) {
                throw new common_1.NotFoundException(err.message);
            }
            throw err;
        });
    }
    async addBulkNewLicense(userId, addBulkNewLicensesDto) {
        return this.userServices.addBulkNewLicenses(addBulkNewLicensesDto.licenseKeys, userId);
    }
    async getUserProfile(username) {
        return this.userServices.getUserProfile(username);
    }
    async updateProfile(username, updateProfileDto) {
        const updatedAttributes = updateProfileDto.attributes;
        return this.userServices.updateUserWithCustomField(username, updatedAttributes);
    }
};
__decorate([
    swagger_1.ApiOperation({ summary: 'Get all licenses of particular user' }),
    common_1.Get('/:userId/licenses'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, common_1.Param('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUserLicenses", null);
__decorate([
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({ summary: 'Add Single License Key' }),
    common_1.Post('/:userId/add-new-license'),
    openapi.ApiResponse({ status: 201, type: require("../licensekey/schemas/licensekey.schema").LicenseKey }),
    __param(0, common_1.Param('userId')),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, index_1.AddNewLicenseDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "addNewLicense", null);
__decorate([
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({ summary: 'Add Bulk License Keys' }),
    common_1.Post('/:userId/add-new-licenses'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, common_1.Param('userId')),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, index_1.AddBulkNewLicensesDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "addBulkNewLicense", null);
__decorate([
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({ summary: 'Get User profile by username' }),
    common_1.Get('/:username/profile'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, common_1.Param('username')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUserProfile", null);
__decorate([
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({ summary: 'Update user profile by username' }),
    common_1.Post('/:username/update-profile'),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, common_1.Param('username')),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, index_1.UpdateProfileDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateProfile", null);
UserController = __decorate([
    swagger_1.ApiTags('User Controller'),
    common_1.Controller('users'),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map