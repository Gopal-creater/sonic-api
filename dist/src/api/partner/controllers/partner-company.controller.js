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
exports.PartnerCompanyController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const partner_service_1 = require("../services/partner.service");
const swagger_1 = require("@nestjs/swagger");
const company_service_1 = require("../../company/company.service");
const partner_company_1 = require("../dto/partnercompany/partner-company");
const partner_company_service_1 = require("../services/partner-company.service");
let PartnerCompanyController = class PartnerCompanyController {
    constructor(partnerService, companyService, partnerCompanyService) {
        this.partnerService = partnerService;
        this.companyService = companyService;
        this.partnerCompanyService = partnerCompanyService;
    }
    async createNewCompany(partner, createPartnerCompanyDto) {
        const { owner } = createPartnerCompanyDto;
        const userFromDb = await this.partnerService.userService.getUserProfile(owner);
        if (!userFromDb)
            throw new common_1.NotFoundException('Unknown user');
        if (userFromDb.adminCompany) {
            throw new common_1.UnprocessableEntityException('Given user already own the company, please choose different user as a company admin');
        }
        const partnerFromDb = await this.partnerService.findById(partner);
        if (!partnerFromDb)
            throw new common_1.NotFoundException('Unknown partner');
        return this.companyService.create(Object.assign(Object.assign({}, createPartnerCompanyDto), { partner: partner }));
    }
    async updateCompany(partner, company, updatePartnerCompanyDto) {
        const partnerFromDb = await this.partnerService.findById(partner);
        if (!partnerFromDb)
            throw new common_1.NotFoundException('Unknown partner');
        const companyFromDb = await this.companyService.findOne({
            _id: company,
            partner: partner,
        });
        if (!companyFromDb)
            throw new common_1.NotFoundException('Unknown company');
        return this.companyService.companyModel.findByIdAndUpdate(company, Object.assign({}, updatePartnerCompanyDto), { new: true });
    }
    async changeAdminUser(partner, company, user) {
        const partnerFromDb = await this.partnerService.findById(partner);
        if (!partnerFromDb)
            throw new common_1.NotFoundException('Unknown partner');
        const companyFromDb = await this.companyService.findOne({
            _id: company,
            partner: partner,
        });
        if (!companyFromDb)
            throw new common_1.NotFoundException('Unknown company');
        return this.companyService.makeCompanyAdminUser(company, user);
    }
    async disableCompany(partner, company) {
        const partnerFromDb = await this.partnerService.findById(partner);
        if (!partnerFromDb)
            throw new common_1.NotFoundException('Unknown partner');
        const companyFromDb = await this.companyService.findOne({
            _id: company,
            partner: partner,
        });
        if (!companyFromDb)
            throw new common_1.NotFoundException('Unknown company');
        return this.companyService.companyModel.findByIdAndUpdate(company, {
            enabled: false,
        }, { new: true });
    }
    async enableCompany(partner, company) {
        const partnerFromDb = await this.partnerService.findById(partner);
        if (!partnerFromDb)
            throw new common_1.NotFoundException('Unknown partner');
        const companyFromDb = await this.companyService.findOne({
            _id: company,
            partner: partner,
        });
        if (!companyFromDb)
            throw new common_1.NotFoundException('Unknown company');
        return this.companyService.companyModel.findByIdAndUpdate(company, {
            enabled: true,
        }, { new: true });
    }
};
__decorate([
    common_1.Put('/create-new-company'),
    swagger_1.ApiOperation({ summary: 'Create new company under given partner' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, common_1.Param('partner')),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, partner_company_1.CreatePartnerCompanyDto]),
    __metadata("design:returntype", Promise)
], PartnerCompanyController.prototype, "createNewCompany", null);
__decorate([
    common_1.Put('/:company/update-company'),
    swagger_1.ApiOperation({
        summary: 'Update company details under given partner',
    }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, common_1.Param('partner')),
    __param(1, common_1.Param('company')),
    __param(2, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, partner_company_1.UpdatePartnerCompanyDto]),
    __metadata("design:returntype", Promise)
], PartnerCompanyController.prototype, "updateCompany", null);
__decorate([
    common_1.Put('/:company/change-company-admin-user'),
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
    __param(0, common_1.Param('partner')),
    __param(1, common_1.Param('company')),
    __param(2, common_1.Body('user')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], PartnerCompanyController.prototype, "changeAdminUser", null);
__decorate([
    common_1.Put('/:company/disable-company'),
    swagger_1.ApiOperation({
        summary: 'Disable company',
    }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, common_1.Param('partner')),
    __param(1, common_1.Param('company')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PartnerCompanyController.prototype, "disableCompany", null);
__decorate([
    common_1.Put('/:company/enable-company'),
    swagger_1.ApiOperation({
        summary: 'Enable Company',
    }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, common_1.Param('partner')),
    __param(1, common_1.Param('company')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PartnerCompanyController.prototype, "enableCompany", null);
PartnerCompanyController = __decorate([
    swagger_1.ApiTags('Partners Controller'),
    common_1.Controller('partners/:partner/companies'),
    __metadata("design:paramtypes", [partner_service_1.PartnerService,
        company_service_1.CompanyService,
        partner_company_service_1.PartnerCompanyService])
], PartnerCompanyController);
exports.PartnerCompanyController = PartnerCompanyController;
//# sourceMappingURL=partner-company.controller.js.map