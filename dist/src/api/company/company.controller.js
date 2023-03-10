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
const user_decorator_1 = require("../auth/decorators/user.decorator");
const user_db_schema_1 = require("../user/schemas/user.db.schema");
const utils_1 = require("../../shared/utils");
const file_handler_service_1 = require("../../shared/services/file-handler.service");
let CompanyController = class CompanyController {
    constructor(companyService, fileHandlerService) {
        this.companyService = companyService;
        this.fileHandlerService = fileHandlerService;
    }
    async create(createCompanyDto, loggedInUser) {
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
        return this.companyService.create(Object.assign(Object.assign({}, createCompanyDto), { createdBy: loggedInUser === null || loggedInUser === void 0 ? void 0 : loggedInUser._id }));
    }
    findAll(queryDto) {
        return this.companyService.findAll(queryDto);
    }
    getEncodesByCompaniesReport(queryDto) {
        return this.companyService.getEncodesByCompaniesReport(queryDto);
    }
    async exportEncodesByCompaniesReport(res, format, queryDto) {
        if (!['xlsx', 'csv'].includes(format))
            throw new common_1.BadRequestException('Unsupported format');
        queryDto.limit = (queryDto === null || queryDto === void 0 ? void 0 : queryDto.limit) <= 2000 ? queryDto === null || queryDto === void 0 ? void 0 : queryDto.limit : 2000;
        const filePath = await this.companyService.exportEncodeByCompaniesReport(queryDto, format);
        const fileName = utils_1.extractFileName(filePath);
        res.download(filePath, `exported_encodes_by_companies_${format}.${fileName.split('.')[1]}`, err => {
            if (err) {
                this.fileHandlerService.deleteFileAtPath(filePath);
                res.send(err);
            }
            this.fileHandlerService.deleteFileAtPath(filePath);
        });
    }
    async changeAdminUser(company, user, loggedInUser) {
        const companyFromDb = await this.companyService.findOne({
            _id: company,
        });
        if (!companyFromDb)
            throw new common_1.NotFoundException('Unknown company');
        await this.companyService.makeCompanyAdminUser(company, user);
        return this.companyService.update(company, {
            updatedBy: loggedInUser === null || loggedInUser === void 0 ? void 0 : loggedInUser._id,
        });
    }
    async update(id, updateCompanyDto, loggedInUser) {
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
        return this.companyService.update(id, Object.assign(Object.assign({}, updateCompanyDto), { updatedBy: loggedInUser === null || loggedInUser === void 0 ? void 0 : loggedInUser._id }));
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
    async findById(id) {
        const company = await this.companyService.findById(id);
        if (!company) {
            return new common_1.NotFoundException();
        }
        return company;
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
    __param(1, user_decorator_1.User()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_company_dto_1.CreateCompanyDto,
        user_db_schema_1.UserDB]),
    __metadata("design:returntype", Promise)
], CompanyController.prototype, "create", null);
__decorate([
    swagger_1.ApiOperation({
        summary: 'Get companies',
    }),
    decorators_1.RolesAllowed(Enums_1.Roles.ADMIN, Enums_1.Roles.PARTNER_ADMIN),
    common_1.UseGuards(guards_1.JwtAuthGuard, guards_1.RoleBasedGuard),
    swagger_1.ApiBearerAuth(),
    common_1.Get(),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, common_1.Query(new parseQueryValue_pipe_1.ParseQueryValue())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [parsedquery_dto_1.ParsedQueryDto]),
    __metadata("design:returntype", void 0)
], CompanyController.prototype, "findAll", null);
__decorate([
    swagger_1.ApiOperation({
        summary: 'Get encodes by companies',
    }),
    decorators_1.RolesAllowed(),
    common_1.UseGuards(guards_1.JwtAuthGuard, guards_1.RoleBasedGuard),
    swagger_1.ApiBearerAuth(),
    common_1.Get('/reports/get-encodes-by-companies'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, common_1.Query(new parseQueryValue_pipe_1.ParseQueryValue())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [parsedquery_dto_1.ParsedQueryDto]),
    __metadata("design:returntype", void 0)
], CompanyController.prototype, "getEncodesByCompaniesReport", null);
__decorate([
    common_1.Get('/export/encodes-by-companies/:format'),
    swagger_1.ApiParam({ name: 'format', enum: ['xlsx', 'csv'] }),
    swagger_1.ApiOperation({ summary: 'Export Encodes By Company' }),
    decorators_1.RolesAllowed(),
    common_1.UseGuards(guards_1.JwtAuthGuard, guards_1.RoleBasedGuard),
    swagger_1.ApiBearerAuth(),
    openapi.ApiResponse({ status: 200 }),
    __param(0, common_1.Res()),
    __param(1, common_1.Param('format')),
    __param(2, common_1.Query(new parseQueryValue_pipe_1.ParseQueryValue())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, parsedquery_dto_1.ParsedQueryDto]),
    __metadata("design:returntype", Promise)
], CompanyController.prototype, "exportEncodesByCompaniesReport", null);
__decorate([
    decorators_1.RolesAllowed(Enums_1.Roles.ADMIN, Enums_1.Roles.PARTNER_ADMIN),
    common_1.UseGuards(guards_1.JwtAuthGuard, guards_1.RoleBasedGuard, change_company_admin_security_guard_1.ChangeCompanyAdminSecurityGuard),
    common_1.Put(':id/change-company-admin-user'),
    swagger_1.ApiBearerAuth(),
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
    __param(2, user_decorator_1.User()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_company_dto_1.UpdateCompanyDto,
        user_db_schema_1.UserDB]),
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
__decorate([
    decorators_1.RolesAllowed(),
    common_1.UseGuards(guards_1.JwtAuthGuard, guards_1.RoleBasedGuard, get_company_security_guard_1.GetCompanySecurityGuard),
    swagger_1.ApiBearerAuth(),
    common_1.Get(':id'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CompanyController.prototype, "findById", null);
CompanyController = __decorate([
    swagger_1.ApiTags('Company Controller (D & M May 2022)'),
    common_1.Controller('companies'),
    __metadata("design:paramtypes", [company_service_1.CompanyService,
        file_handler_service_1.FileHandlerService])
], CompanyController);
exports.CompanyController = CompanyController;
//# sourceMappingURL=company.controller.js.map