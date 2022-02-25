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
exports.LicensekeyOwnerController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const licensekey_service_1 = require("../services/licensekey.service");
const swagger_1 = require("@nestjs/swagger");
const decorators_1 = require("../../auth/decorators");
const roles_decorator_1 = require("../../auth/decorators/roles.decorator");
const Enums_1 = require("../../../constants/Enums");
const role_based_guard_1 = require("../../auth/guards/role-based.guard");
const owner_dto_1 = require("../dto/owner/owner.dto");
let LicensekeyOwnerController = class LicensekeyOwnerController {
    constructor(licensekeyService) {
        this.licensekeyService = licensekeyService;
    }
    async create(addOwnerDto, licenseId, updatedBy) {
        const key = await this.licensekeyService.licenseKeyModel.findById(licenseId);
        if (!key)
            throw new common_1.NotFoundException('License not found');
        const user = await this.licensekeyService.userService.getUserProfile(addOwnerDto.usernameOrSub);
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const updatedLicense = await this.licensekeyService.addOwnerToLicense(licenseId, user.sub);
        await this.licensekeyService.licenseKeyModel.findOneAndUpdate({ _id: licenseId }, { updatedBy: updatedBy }, { new: true });
        return updatedLicense;
    }
    async remove(licenseId, usernameOrSub) {
        const key = await this.licensekeyService.licenseKeyModel.findById(licenseId);
        if (!key)
            throw new common_1.NotFoundException('License not found');
        const user = await this.licensekeyService.userService.getUserProfile(usernameOrSub);
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return this.licensekeyService.removeOwnerFromLicense(licenseId, user.sub);
    }
};
__decorate([
    common_1.Put(),
    roles_decorator_1.RolesAllowed(Enums_1.Roles.ADMIN),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard, role_based_guard_1.RoleBasedGuard),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({ summary: 'Add Owner to the license' }),
    openapi.ApiResponse({ status: 200, type: require("../schemas/licensekey.schema").LicenseKey }),
    __param(0, common_1.Body()),
    __param(1, common_1.Param('licenseId')),
    __param(2, decorators_1.User('sub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [owner_dto_1.AddOwnerDto, String, String]),
    __metadata("design:returntype", Promise)
], LicensekeyOwnerController.prototype, "create", null);
__decorate([
    common_1.Delete(':usernameOrSub'),
    roles_decorator_1.RolesAllowed(Enums_1.Roles.ADMIN),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard, role_based_guard_1.RoleBasedGuard),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({ summary: 'Delete User from this license' }),
    openapi.ApiResponse({ status: 200, type: require("../schemas/licensekey.schema").LicenseKey }),
    __param(0, common_1.Param('licenseId')),
    __param(1, common_1.Param('usernameOrSub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], LicensekeyOwnerController.prototype, "remove", null);
LicensekeyOwnerController = __decorate([
    swagger_1.ApiTags('License Keys Owner Management Controller'),
    common_1.Controller('license-keys/:licenseId/owners'),
    __metadata("design:paramtypes", [licensekey_service_1.LicensekeyService])
], LicensekeyOwnerController);
exports.LicensekeyOwnerController = LicensekeyOwnerController;
//# sourceMappingURL=licensekey-owner.controller.js.map