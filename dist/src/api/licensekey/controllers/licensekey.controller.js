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
exports.LicensekeyController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const licensekey_service_1 = require("../services/licensekey.service");
const create_licensekey_dto_1 = require("../dto/create-licensekey.dto");
const swagger_1 = require("@nestjs/swagger");
const parseQueryValue_pipe_1 = require("../../../shared/pipes/parseQueryValue.pipe");
const parsedquery_dto_1 = require("../../../shared/dtos/parsedquery.dto");
const anyapiquerytemplate_decorator_1 = require("../../../shared/decorators/anyapiquerytemplate.decorator");
const decorators_1 = require("../../auth/decorators");
const roles_decorator_1 = require("../../auth/decorators/roles.decorator");
const Enums_1 = require("../../../constants/Enums");
const role_based_guard_1 = require("../../auth/guards/role-based.guard");
const user_db_schema_1 = require("../../user/schemas/user.db.schema");
const create_license_security_guard_1 = require("../guards/create-license-security.guard");
const update_license_security_guard_1 = require("../guards/update-license-security.guard");
const delete_license_security_guard_1 = require("../guards/delete-license-security.guard");
const update_licensekey_dto_1 = require("../dto/update-licensekey.dto");
const adduserto_license_security_guard_copy_1 = require("../guards/adduserto-license-security.guard copy");
const getone_license_security_guard_1 = require("../guards/getone-license-security.guard");
let LicensekeyController = class LicensekeyController {
    constructor(licensekeyService) {
        this.licensekeyService = licensekeyService;
    }
    async create(createLicensekeyDto, loggedInUser) {
        const doc = Object.assign(Object.assign({}, createLicensekeyDto), { createdBy: loggedInUser === null || loggedInUser === void 0 ? void 0 : loggedInUser.sub });
        if (createLicensekeyDto.type == Enums_1.ApiKeyType.INDIVIDUAL) {
            const user = await this.licensekeyService.userService.getUserProfile(createLicensekeyDto.user);
            if (!user)
                throw new common_1.NotFoundException('Unknown user');
            doc.users = [createLicensekeyDto.user];
        }
        else if (createLicensekeyDto.type == Enums_1.ApiKeyType.COMPANY) {
            const company = await this.licensekeyService.companyService.findById(createLicensekeyDto.company);
            if (!company)
                throw new common_1.NotFoundException('Unknown company');
            if (createLicensekeyDto.user) {
                const user = await this.licensekeyService.userService.getUserProfile(createLicensekeyDto.user);
                if (!user)
                    throw new common_1.NotFoundException('Unknown user');
                doc.users = [createLicensekeyDto.user];
            }
        }
        return this.licensekeyService.create(doc);
    }
    findAll(queryDto) {
        return this.licensekeyService.findAll(queryDto);
    }
    async getCount(queryDto) {
        return this.licensekeyService.getCount(queryDto);
    }
    async getEstimateCount() {
        return this.licensekeyService.getEstimateCount();
    }
    async findOne(id) {
        const licenseKey = await this.licensekeyService.licenseKeyModel.findById(id);
        if (!licenseKey) {
            throw new common_1.NotFoundException();
        }
        return licenseKey;
    }
    async update(id, updateLicensekeyDto, updatedBy) {
        const licenseKey = await this.licensekeyService.findById(id);
        if (!licenseKey) {
            throw new common_1.NotFoundException();
        }
        const updatedKey = await this.licensekeyService.update(id, Object.assign(Object.assign({}, updateLicensekeyDto), { updatedBy: updatedBy }));
        return updatedKey;
    }
    async addNewUser(id, addUserToLicense, updatedBy) {
        const { user } = addUserToLicense;
        const licenseKey = await this.licensekeyService.findById(id);
        if (!licenseKey) {
            throw new common_1.NotFoundException('Licensekey not found');
        }
        if (licenseKey.type == Enums_1.ApiKeyType.INDIVIDUAL && licenseKey.users.length > 0) {
            throw new common_1.UnprocessableEntityException('Can not add user to individual license type');
        }
        const userformdb = await this.licensekeyService.userService.findById(user);
        if (!userformdb) {
            throw new common_1.NotFoundException('User not found');
        }
        const updatedKey = await this.licensekeyService.update(id, {
            $addToSet: {
                users: { $each: [user] },
            },
            updatedBy: updatedBy,
        });
        return updatedKey;
    }
    async removeUser(id, addUserToLicense, updatedBy) {
        const { user } = addUserToLicense;
        const licenseKey = await this.licensekeyService.findById(id);
        if (!licenseKey) {
            throw new common_1.NotFoundException('Licensekey not found');
        }
        const userformdb = await this.licensekeyService.userService.findById(user);
        if (!userformdb) {
            throw new common_1.NotFoundException('User not found');
        }
        const updatedKey = await this.licensekeyService.update(id, {
            $pull: {
                users: user,
            },
            updatedBy: updatedBy,
        });
        return updatedKey;
    }
    async remove(id) {
        const licenseKey = await this.licensekeyService.findById(id);
        if (!licenseKey) {
            throw new common_1.NotFoundException();
        }
        return this.licensekeyService.licenseKeyModel.findByIdAndRemove(id);
    }
};
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.RolesAllowed)(Enums_1.Roles.ADMIN, Enums_1.Roles.THIRDPARTY_ADMIN, Enums_1.Roles.PARTNER_ADMIN, Enums_1.Roles.COMPANY_ADMIN),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_based_guard_1.RoleBasedGuard, create_license_security_guard_1.CreateLicenseSecurityGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create License Key' }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, decorators_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_licensekey_dto_1.CreateLicensekeyDto,
        user_db_schema_1.UserDB]),
    __metadata("design:returntype", Promise)
], LicensekeyController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.RolesAllowed)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_based_guard_1.RoleBasedGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, anyapiquerytemplate_decorator_1.AnyApiQueryTemplate)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get All LicenseKeys' }),
    openapi.ApiResponse({ status: 200, type: require("../dto/mongoosepaginate-licensekey.dto").MongoosePaginateLicensekeyDto }),
    __param(0, (0, common_1.Query)(new parseQueryValue_pipe_1.ParseQueryValue())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [parsedquery_dto_1.ParsedQueryDto]),
    __metadata("design:returntype", void 0)
], LicensekeyController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('/count'),
    (0, roles_decorator_1.RolesAllowed)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_based_guard_1.RoleBasedGuard),
    (0, anyapiquerytemplate_decorator_1.AnyApiQueryTemplate)(),
    (0, swagger_1.ApiQuery)({ name: 'includeGroupData', type: Boolean, required: false }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get count of all licenskeys also accept filter as query params',
    }),
    openapi.ApiResponse({ status: 200, type: Number }),
    __param(0, (0, common_1.Query)(new parseQueryValue_pipe_1.ParseQueryValue())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [parsedquery_dto_1.ParsedQueryDto]),
    __metadata("design:returntype", Promise)
], LicensekeyController.prototype, "getCount", null);
__decorate([
    (0, common_1.Get)('/estimate-count'),
    (0, roles_decorator_1.RolesAllowed)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_based_guard_1.RoleBasedGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all count of all licenskeys',
    }),
    openapi.ApiResponse({ status: 200, type: Number }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LicensekeyController.prototype, "getEstimateCount", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.RolesAllowed)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_based_guard_1.RoleBasedGuard, getone_license_security_guard_1.GetOneLicenseSecurityGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get Single License key' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LicensekeyController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, roles_decorator_1.RolesAllowed)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_based_guard_1.RoleBasedGuard, update_license_security_guard_1.UpdateLicenseSecurityGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update Single License key' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, decorators_1.User)('sub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_licensekey_dto_1.AdminUpdateLicensekeyDto, String]),
    __metadata("design:returntype", Promise)
], LicensekeyController.prototype, "update", null);
__decorate([
    (0, common_1.Put)(':id/add-new-user'),
    (0, roles_decorator_1.RolesAllowed)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_based_guard_1.RoleBasedGuard, adduserto_license_security_guard_copy_1.AddUserToLicenseSecurityGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Add new user to license key' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, decorators_1.User)('sub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_licensekey_dto_1.AddUserToLicense, String]),
    __metadata("design:returntype", Promise)
], LicensekeyController.prototype, "addNewUser", null);
__decorate([
    (0, common_1.Put)(':id/remove-user'),
    (0, roles_decorator_1.RolesAllowed)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_based_guard_1.RoleBasedGuard, adduserto_license_security_guard_copy_1.AddUserToLicenseSecurityGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Remove user from license key' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, decorators_1.User)('sub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_licensekey_dto_1.AddUserToLicense, String]),
    __metadata("design:returntype", Promise)
], LicensekeyController.prototype, "removeUser", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.RolesAllowed)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_based_guard_1.RoleBasedGuard, delete_license_security_guard_1.DeleteLicenseSecurityGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Delete License key' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LicensekeyController.prototype, "remove", null);
LicensekeyController = __decorate([
    (0, swagger_1.ApiTags)('License Keys Management Controller (D & M)'),
    (0, common_1.Controller)('license-keys'),
    __metadata("design:paramtypes", [licensekey_service_1.LicensekeyService])
], LicensekeyController);
exports.LicensekeyController = LicensekeyController;
//# sourceMappingURL=licensekey.controller.js.map