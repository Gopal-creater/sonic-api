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
exports.PartnerController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const partner_service_1 = require("../services/partner.service");
const create_partner_dto_1 = require("../dto/create-partner.dto");
const update_partner_dto_1 = require("../dto/update-partner.dto");
const swagger_1 = require("@nestjs/swagger");
const parseQueryValue_pipe_1 = require("../../../shared/pipes/parseQueryValue.pipe");
const parsedquery_dto_1 = require("../../../shared/dtos/parsedquery.dto");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const get_partner_security_guard_1 = require("../guards/get-partner-security.guard");
const role_based_guard_1 = require("../../auth/guards/role-based.guard");
const decorators_1 = require("../../auth/decorators");
const Enums_1 = require("../../../constants/Enums");
const update_partner_security_guard_1 = require("../guards/update-partner-security.guard");
const user_decorator_1 = require("../../auth/decorators/user.decorator");
const user_db_schema_1 = require("../../user/schemas/user.db.schema");
let PartnerController = class PartnerController {
    constructor(partnerService) {
        this.partnerService = partnerService;
    }
    async create(loggedInUser, createPartnerDto) {
        if (createPartnerDto.owner) {
            const user = await this.partnerService.userService.getUserProfile(createPartnerDto.owner);
            if (!user)
                throw new common_1.NotFoundException('Unknown user');
            const isalreadyOwnPartner = await this.partnerService.findOne({
                owner: createPartnerDto.owner,
            });
            if (isalreadyOwnPartner || user.adminPartner)
                throw new common_1.NotFoundException('Given user already own the company, please choose different user');
        }
        return this.partnerService.create(Object.assign(Object.assign({}, createPartnerDto), { createdBy: loggedInUser === null || loggedInUser === void 0 ? void 0 : loggedInUser._id }));
    }
    findAll(queryDto) {
        return this.partnerService.findAll(queryDto);
    }
    findById(id) {
        return this.partnerService.findById(id);
    }
    async changeAdminUser(partner, user, loggedInUser) {
        const userFromDb = await this.partnerService.userService.getUserProfile(user);
        if (!userFromDb)
            throw new common_1.NotFoundException('Unknown user');
        if (userFromDb.adminPartner) {
            throw new common_1.UnprocessableEntityException('Given user already own the partner, please choose different user as a partner admin');
        }
        const partnerFromDb = await this.partnerService.findById(partner);
        if (!partnerFromDb)
            throw new common_1.NotFoundException('Unknown partner');
        await this.partnerService.makePartnerAdminUser(user, partner);
        return this.partnerService.update(partner, {
            updatedBy: loggedInUser === null || loggedInUser === void 0 ? void 0 : loggedInUser._id,
        });
    }
    update(id, loggedInUser, updatePartnerDto) {
        return this.partnerService.update(id, Object.assign(Object.assign({}, updatePartnerDto), { updatedBy: loggedInUser === null || loggedInUser === void 0 ? void 0 : loggedInUser._id }));
    }
    async getCount(queryDto) {
        return this.partnerService.getCount(queryDto);
    }
    async getEstimateCount() {
        return this.partnerService.getEstimateCount();
    }
    remove(id) {
        return this.partnerService.removeById(id);
    }
};
__decorate([
    decorators_1.RolesAllowed(Enums_1.Roles.ADMIN),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard, role_based_guard_1.RoleBasedGuard),
    swagger_1.ApiBearerAuth(),
    common_1.Post(),
    swagger_1.ApiOperation({ summary: 'Create partner' }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, user_decorator_1.User()),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_db_schema_1.UserDB,
        create_partner_dto_1.CreatePartnerDto]),
    __metadata("design:returntype", Promise)
], PartnerController.prototype, "create", null);
__decorate([
    swagger_1.ApiOperation({
        summary: 'Get partners',
    }),
    decorators_1.RolesAllowed(Enums_1.Roles.ADMIN),
    swagger_1.ApiBearerAuth(),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard, role_based_guard_1.RoleBasedGuard),
    common_1.Get(),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, common_1.Query(new parseQueryValue_pipe_1.ParseQueryValue())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [parsedquery_dto_1.ParsedQueryDto]),
    __metadata("design:returntype", void 0)
], PartnerController.prototype, "findAll", null);
__decorate([
    swagger_1.ApiOperation({
        summary: 'Get partner by id',
    }),
    decorators_1.RolesAllowed(Enums_1.Roles.ADMIN, Enums_1.Roles.PARTNER_ADMIN, Enums_1.Roles.PARTNER_USER),
    swagger_1.ApiBearerAuth(),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard, role_based_guard_1.RoleBasedGuard, get_partner_security_guard_1.GetPartnerSecurityGuard),
    common_1.Get(':id'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PartnerController.prototype, "findById", null);
__decorate([
    decorators_1.RolesAllowed(Enums_1.Roles.ADMIN),
    swagger_1.ApiBearerAuth(),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard, role_based_guard_1.RoleBasedGuard),
    common_1.Put(':id/change-partner-admin-user'),
    swagger_1.ApiOperation({ summary: 'Change admin user' }),
    swagger_1.ApiBody({
        schema: {
            type: 'object',
            properties: {
                user: { type: 'string' },
            },
        },
    }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, common_1.Param('id')),
    __param(1, common_1.Body('user')),
    __param(2, user_decorator_1.User()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, user_db_schema_1.UserDB]),
    __metadata("design:returntype", Promise)
], PartnerController.prototype, "changeAdminUser", null);
__decorate([
    swagger_1.ApiOperation({
        summary: 'Update partner by id',
    }),
    decorators_1.RolesAllowed(Enums_1.Roles.ADMIN, Enums_1.Roles.PARTNER_ADMIN),
    swagger_1.ApiBearerAuth(),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard, role_based_guard_1.RoleBasedGuard, update_partner_security_guard_1.UpdatePartnerSecurityGuard),
    common_1.Put(':id'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, common_1.Param('id')),
    __param(1, user_decorator_1.User()),
    __param(2, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_db_schema_1.UserDB,
        update_partner_dto_1.UpdatePartnerDto]),
    __metadata("design:returntype", void 0)
], PartnerController.prototype, "update", null);
__decorate([
    common_1.Get('/count'),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({
        summary: 'Get count of all partners also accept filter as query params',
    }),
    openapi.ApiResponse({ status: 200, type: Number }),
    __param(0, common_1.Query(new parseQueryValue_pipe_1.ParseQueryValue())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [parsedquery_dto_1.ParsedQueryDto]),
    __metadata("design:returntype", Promise)
], PartnerController.prototype, "getCount", null);
__decorate([
    common_1.Get('/estimate-count'),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({
        summary: 'Get all count of all partners',
    }),
    openapi.ApiResponse({ status: 200, type: Number }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PartnerController.prototype, "getEstimateCount", null);
__decorate([
    decorators_1.RolesAllowed(Enums_1.Roles.ADMIN),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard, role_based_guard_1.RoleBasedGuard),
    swagger_1.ApiBearerAuth(),
    common_1.Delete(':id'),
    swagger_1.ApiOperation({ summary: 'Remove partner' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PartnerController.prototype, "remove", null);
PartnerController = __decorate([
    swagger_1.ApiTags('Partners Controller (D & M May 2022)'),
    common_1.Controller('partners'),
    __metadata("design:paramtypes", [partner_service_1.PartnerService])
], PartnerController);
exports.PartnerController = PartnerController;
//# sourceMappingURL=partner.controller.js.map