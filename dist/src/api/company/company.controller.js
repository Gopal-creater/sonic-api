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
exports.CompanyController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const company_service_1 = require("./company.service");
const create_company_dto_1 = require("./dtos/create-company.dto");
const update_company_dto_1 = require("./dtos/update-company.dto");
const swagger_1 = require("@nestjs/swagger");
const decorators_1 = require("../auth/decorators");
const guards_1 = require("../auth/guards");
const Enums_1 = require("../../constants/Enums");
const anyapiquerytemplate_decorator_1 = require("../../shared/decorators/anyapiquerytemplate.decorator");
const parseQueryValue_pipe_1 = require("../../shared/pipes/parseQueryValue.pipe");
const parsedquery_dto_1 = require("../../shared/dtos/parsedquery.dto");
const create_company_guard_1 = require("./guards/create-company.guard");
const change_company_admin_security_guard_1 = require("./guards/change-company-admin-security.guard");
const get_company_security_guard_1 = require("./guards/get-company-security.guard");
const update_company_security_guard_1 = require("./guards/update-company-security.guard");
const delete_company_security_guard_1 = require("./guards/delete-company-security.guard");
let CompanyController = class CompanyController {
    constructor(companyService) {
        this.companyService = companyService;
    }
    async create(createCompanyDto) {
        const { owner } = createCompanyDto;
        if (owner) {
            const userFromDb = await this.companyService.userService.getUserProfile(owner);
            if (!userFromDb)
                throw new common_1.NotFoundException('Unknown user');
            const isalreadyOwnCompany = await this.companyService.findOne({
                owner: owner,
            });
            if (userFromDb.adminCompany || isalreadyOwnCompany)
                throw new common_1.NotFoundException('Given user already own the company, please choose different user');
        }
        return this.companyService.create(createCompanyDto);
    }
    findAll(queryDto) {
        return this.companyService.findAll(queryDto);
    }
    async findById(id) {
        const company = await this.companyService.findById(id);
        if (!company) {
            return new common_1.NotFoundException();
        }
        return company;
    }
    async changeAdminUser(company, user) {
        const companyFromDb = await this.companyService.findOne({
            _id: company,
        });
        if (!companyFromDb)
            throw new common_1.NotFoundException('Unknown company');
        return this.companyService.makeCompanyAdminUser(company, user);
    }
    async update(id, updateCompanyDto) {
        const { owner } = updateCompanyDto;
        if (owner) {
            const userFromDb = await this.companyService.userService.getUserProfile(owner);
            if (!userFromDb)
                throw new common_1.NotFoundException('Unknown user');
            const isalreadyOwnCompany = await this.companyService.findOne({
                owner: owner,
            });
            if (userFromDb.adminCompany || isalreadyOwnCompany)
                throw new common_1.NotFoundException('Given user already own the company, please choose different user');
        }
        return this.companyService.update(id, updateCompanyDto);
    }
    async getCount(queryDto) {
        return this.companyService.getCount(queryDto);
    }
    async getEstimateCount() {
        return this.companyService.getEstimateCount();
    }
    async remove(id) {
        const delectedCompany = await this.companyService.removeById(id);
        if (!delectedCompany) {
            return new common_1.NotFoundException();
        }
        return delectedCompany;
    }
};
__decorate([
    decorators_1.RolesAllowed(Enums_1.Roles.ADMIN, Enums_1.Roles.PARTNER_ADMIN),
    common_1.UseGuards(guards_1.JwtAuthGuard, guards_1.RoleBasedGuard, create_company_guard_1.CreateCompanySecurityGuard),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({ summary: 'Create company' }),
    common_1.Post(),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_company_dto_1.CreateCompanyDto]),
    __metadata("design:returntype", Promise)
], CompanyController.prototype, "create", null);
__decorate([
    swagger_1.ApiOperation({
        summary: 'Get companies',
    }),
    decorators_1.RolesAllowed(Enums_1.Roles.ADMIN, Enums_1.Roles.PARTNER_ADMIN),
    common_1.UseGuards(guards_1.JwtAuthGuard, guards_1.RoleBasedGuard),
    common_1.Get(),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, common_1.Query(new parseQueryValue_pipe_1.ParseQueryValue())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [parsedquery_dto_1.ParsedQueryDto]),
    __metadata("design:returntype", void 0)
], CompanyController.prototype, "findAll", null);
__decorate([
    decorators_1.RolesAllowed(),
    common_1.UseGuards(guards_1.JwtAuthGuard, guards_1.RoleBasedGuard, get_company_security_guard_1.GetCompanySecurityGuard),
    common_1.Get(':id'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CompanyController.prototype, "findById", null);
__decorate([
    decorators_1.RolesAllowed(Enums_1.Roles.ADMIN, Enums_1.Roles.PARTNER_ADMIN),
    common_1.UseGuards(guards_1.JwtAuthGuard, guards_1.RoleBasedGuard, change_company_admin_security_guard_1.ChangeCompanyAdminSecurityGuard),
    common_1.Put(':id/change-company-admin-user'),
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
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CompanyController.prototype, "changeAdminUser", null);
__decorate([
    common_1.Put(':id'),
    decorators_1.RolesAllowed(Enums_1.Roles.ADMIN, Enums_1.Roles.COMPANY_ADMIN, Enums_1.Roles.PARTNER_ADMIN),
    common_1.UseGuards(guards_1.JwtAuthGuard, guards_1.RoleBasedGuard, update_company_security_guard_1.UpdateCompanySecurityGuard),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({ summary: 'Update company' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, common_1.Param('id')),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_company_dto_1.UpdateCompanyDto]),
    __metadata("design:returntype", Promise)
], CompanyController.prototype, "update", null);
__decorate([
    common_1.Get('/count'),
    common_1.UseGuards(guards_1.JwtAuthGuard),
    anyapiquerytemplate_decorator_1.AnyApiQueryTemplate(),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({
        summary: 'Get count of all companies also accept filter as query params',
    }),
    openapi.ApiResponse({ status: 200, type: Number }),
    __param(0, common_1.Query(new parseQueryValue_pipe_1.ParseQueryValue())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [parsedquery_dto_1.ParsedQueryDto]),
    __metadata("design:returntype", Promise)
], CompanyController.prototype, "getCount", null);
__decorate([
    common_1.Get('/estimate-count'),
    common_1.UseGuards(guards_1.JwtAuthGuard),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({
        summary: 'Get all count of all companies',
    }),
    openapi.ApiResponse({ status: 200, type: Number }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CompanyController.prototype, "getEstimateCount", null);
__decorate([
    common_1.Delete(':id'),
    decorators_1.RolesAllowed(Enums_1.Roles.ADMIN, Enums_1.Roles.PARTNER_ADMIN),
    common_1.UseGuards(guards_1.JwtAuthGuard, guards_1.RoleBasedGuard, delete_company_security_guard_1.DeleteCompanySecurityGuard),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({ summary: 'Remove company' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CompanyController.prototype, "remove", null);
CompanyController = __decorate([
    swagger_1.ApiTags('Company Controller'),
    common_1.Controller('companies'),
    __metadata("design:paramtypes", [company_service_1.CompanyService])
], CompanyController);
exports.CompanyController = CompanyController;
//# sourceMappingURL=company.controller.js.map