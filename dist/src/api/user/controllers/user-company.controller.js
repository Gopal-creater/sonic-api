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
exports.UserCompanyController = void 0;
const openapi = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const swagger_1 = require("@nestjs/swagger");
const index_1 = require("../dtos/index");
const user_service_1 = require("../services/user.service");
const common_1 = require("@nestjs/common");
const roles_decorator_1 = require("../../auth/decorators/roles.decorator");
const Enums_1 = require("../../../constants/Enums");
const role_based_guard_1 = require("../../auth/guards/role-based.guard");
const company_service_1 = require("../../company/company.service");
const user_company_service_1 = require("../services/user-company.service");
let UserCompanyController = class UserCompanyController {
    constructor(userServices, companyService, userCompanyService) {
        this.userServices = userServices;
        this.companyService = companyService;
        this.userCompanyService = userCompanyService;
    }
    async addUserToCompany(addUserToCompanyDto) {
        const { user, company } = addUserToCompanyDto;
        const validUser = await this.userServices.findById(user);
        if (!validUser) {
            throw new common_1.NotFoundException("Invalid user");
        }
        const validCompany = await this.companyService.findById(company);
        if (!validCompany) {
            throw new common_1.NotFoundException("Invalid company");
        }
        return this.userCompanyService.addUserToCompany(validUser, validCompany);
    }
    async removeUserFromCompany(removeUserFromCompanyDto) {
        const { user, company } = removeUserFromCompanyDto;
        const validUser = await this.userServices.findById(user);
        if (!validUser) {
            throw new common_1.NotFoundException("Invalid user");
        }
        const validCompany = await this.companyService.findById(company);
        if (!validCompany) {
            throw new common_1.NotFoundException("Invalid company");
        }
        return this.userCompanyService.removeUserFromCompany(validUser, validCompany);
    }
    async listAllGroupsForUser(user) {
        const validUser = await this.userServices.findById(user);
        return this.userCompanyService.listAllCompaniesForUser(validUser);
    }
    async makeAdminCompany(makeAdminCompanyDto) {
        const { user, company } = makeAdminCompanyDto;
        const validUser = await this.userServices.findById(user);
        if (!validUser) {
            throw new common_1.NotFoundException("Invalid user");
        }
        const validCompany = await this.companyService.findById(company);
        if (!validCompany) {
            throw new common_1.NotFoundException("Invalid company");
        }
        return this.companyService.makeCompanyAdminUser(company, user);
    }
    async getAdminCompany(user) {
        const validUser = await this.userServices.findById(user);
        if (!validUser) {
            throw new common_1.NotFoundException("Invalid user");
        }
        return this.userCompanyService.getCompanyAdmin(validUser);
    }
};
__decorate([
    roles_decorator_1.RolesAllowed(Enums_1.Roles.ADMIN),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard, role_based_guard_1.RoleBasedGuard),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({ summary: 'add user to company' }),
    common_1.Post('/companies/add-user-to-company'),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [index_1.AddUserToCompanyDto]),
    __metadata("design:returntype", Promise)
], UserCompanyController.prototype, "addUserToCompany", null);
__decorate([
    roles_decorator_1.RolesAllowed(Enums_1.Roles.ADMIN),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard, role_based_guard_1.RoleBasedGuard),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({ summary: 'remove user from company' }),
    common_1.Delete('/companies/remove-user-from-company'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [index_1.RemoveUserFromCompanyDto]),
    __metadata("design:returntype", Promise)
], UserCompanyController.prototype, "removeUserFromCompany", null);
__decorate([
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({ summary: 'get company of particular user' }),
    common_1.Get('/companies/list-companies/:user'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, common_1.Param('user')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserCompanyController.prototype, "listAllGroupsForUser", null);
__decorate([
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({ summary: 'make admin company' }),
    common_1.Post('/companies/make-admin-company'),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [index_1.MakeAdminCompanyDto]),
    __metadata("design:returntype", Promise)
], UserCompanyController.prototype, "makeAdminCompany", null);
__decorate([
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({ summary: 'make admin company' }),
    common_1.Get('/companies/get-admin-company/:user'),
    openapi.ApiResponse({ status: 200, type: require("../../company/schemas/company.schema").Company }),
    __param(0, common_1.Param('user')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserCompanyController.prototype, "getAdminCompany", null);
UserCompanyController = __decorate([
    swagger_1.ApiTags('User Controller'),
    common_1.Controller('users'),
    __metadata("design:paramtypes", [user_service_1.UserService,
        company_service_1.CompanyService,
        user_company_service_1.UserCompanyService])
], UserCompanyController);
exports.UserCompanyController = UserCompanyController;
//# sourceMappingURL=user-company.controller.js.map