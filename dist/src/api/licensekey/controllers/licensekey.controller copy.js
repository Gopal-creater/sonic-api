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
const Roles_1 = require("../../../constants/Roles");
const role_based_guard_1 = require("../../auth/guards/role-based.guard");
let LicensekeyController = class LicensekeyController {
    constructor(licensekeyService) {
        this.licensekeyService = licensekeyService;
    }
    migrate() {
        return this.licensekeyService.migrateKeyFromKeygenToDB();
    }
    create(createLicensekeyDto, createdBy) {
        return this.licensekeyService.create(createLicensekeyDto, createdBy);
    }
    findAll(queryDto) {
        return this.licensekeyService.findAll(queryDto);
    }
    async getCount(queryDto) {
        const filter = queryDto.filter || {};
        return this.licensekeyService.licenseKeyModel
            .where(filter)
            .countDocuments();
    }
    async findOne(id) {
        const licenseKey = await this.licensekeyService.licenseKeyModel.findById(id);
        if (!licenseKey) {
            throw new common_1.NotFoundException();
        }
        return licenseKey;
    }
    async update(id, updateLicensekeyDto, updatedBy) {
        const updatedKey = await this.licensekeyService.licenseKeyModel.findOneAndUpdate({ _id: id }, Object.assign(Object.assign({}, updateLicensekeyDto), { updatedBy: updatedBy }), { new: true });
        if (!updatedKey) {
            throw new common_1.NotFoundException();
        }
        return updatedKey;
    }
    remove(id) {
        return this.licensekeyService.licenseKeyModel.findByIdAndRemove(id);
    }
};
__decorate([
    common_1.Get('/migrate-from-keygen'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LicensekeyController.prototype, "migrate", null);
__decorate([
    common_1.Post(),
    roles_decorator_1.RolesAllowed(Roles_1.Roles.ADMIN),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard, role_based_guard_1.RoleBasedGuard),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({ summary: 'Create License Key' }),
    __param(0, common_1.Body()),
    __param(1, decorators_1.User('sub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_licensekey_dto_1.CreateLicensekeyDto, String]),
    __metadata("design:returntype", void 0)
], LicensekeyController.prototype, "create", null);
__decorate([
    common_1.Get(),
    roles_decorator_1.RolesAllowed(Roles_1.Roles.ADMIN),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard, role_based_guard_1.RoleBasedGuard),
    swagger_1.ApiBearerAuth(),
    anyapiquerytemplate_decorator_1.AnyApiQueryTemplate(),
    swagger_1.ApiOperation({ summary: 'Get All LicenseJKeys' }),
    __param(0, common_1.Query(new parseQueryValue_pipe_1.ParseQueryValue())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [parsedquery_dto_1.ParsedQueryDto]),
    __metadata("design:returntype", void 0)
], LicensekeyController.prototype, "findAll", null);
__decorate([
    common_1.Get('/count'),
    roles_decorator_1.RolesAllowed(Roles_1.Roles.ADMIN),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard, role_based_guard_1.RoleBasedGuard),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({
        summary: 'Get count of all license-keys also accept filter as query params',
    }),
    __param(0, common_1.Query(new parseQueryValue_pipe_1.ParseQueryValue())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [parsedquery_dto_1.ParsedQueryDto]),
    __metadata("design:returntype", Promise)
], LicensekeyController.prototype, "getCount", null);
__decorate([
    common_1.Get(':id'),
    roles_decorator_1.RolesAllowed(Roles_1.Roles.ADMIN),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard, role_based_guard_1.RoleBasedGuard),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({ summary: 'Get Single License key' }),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LicensekeyController.prototype, "findOne", null);
__decorate([
    common_1.Put(':id'),
    roles_decorator_1.RolesAllowed(Roles_1.Roles.ADMIN),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard, role_based_guard_1.RoleBasedGuard),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({ summary: 'Update Single License key' }),
    __param(0, common_1.Param('id')),
    __param(1, common_1.Body()),
    __param(2, decorators_1.User('sub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_licensekey_dto_1.AdminUpdateLicensekeyDto, String]),
    __metadata("design:returntype", Promise)
], LicensekeyController.prototype, "update", null);
__decorate([
    common_1.Delete(':id'),
    roles_decorator_1.RolesAllowed(Roles_1.Roles.ADMIN),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard, role_based_guard_1.RoleBasedGuard),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({ summary: 'Delete License key' }),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LicensekeyController.prototype, "remove", null);
LicensekeyController = __decorate([
    swagger_1.ApiTags('License Keys Management Controller'),
    common_1.Controller('license-keys'),
    __metadata("design:paramtypes", [licensekey_service_1.LicensekeyService])
], LicensekeyController);
exports.LicensekeyController = LicensekeyController;
//# sourceMappingURL=licensekey.controller copy.js.map