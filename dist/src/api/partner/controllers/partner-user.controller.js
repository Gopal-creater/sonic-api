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
exports.PartnerUserController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const partner_service_1 = require("../services/partner.service");
const swagger_1 = require("@nestjs/swagger");
const partner_user_service_1 = require("../services/partner-user.service");
const partner_user_1 = require("../dto/partneruser/partner-user");
const Enums_1 = require("../../../constants/Enums");
const company_service_1 = require("../../company/company.service");
let PartnerUserController = class PartnerUserController {
    constructor(partnerService, companyService, partnerUserService) {
        this.partnerService = partnerService;
        this.companyService = companyService;
        this.partnerUserService = partnerUserService;
    }
    async changeAdminUser(partner, user) {
        const userFromDb = await this.partnerService.userService.getUserProfile(user);
        if (!userFromDb)
            throw new common_1.NotFoundException('Unknown user');
        if (userFromDb.adminPartner) {
            throw new common_1.UnprocessableEntityException('Given user already own the partner, please choose different user as a partner');
        }
        const partnerFromDb = await this.partnerService.findById(partner);
        if (!partnerFromDb)
            throw new common_1.NotFoundException('Unknown partner');
        return this.partnerUserService.changeAdminUser(user, partner);
    }
    async createUser(partner, createPartnerUserDto) {
        const { company, email, userName } = createPartnerUserDto;
        const userFromDb = await this.partnerService.userService.findOne({
            $or: [{ email: email }, { username: userName }],
        });
        if (userFromDb)
            throw new common_1.UnprocessableEntityException('User with given email or username already exists');
        const partnerFromDb = await this.partnerService.findById(partner);
        if (!partnerFromDb)
            throw new common_1.NotFoundException('Unknown partner');
        if (company) {
            const companyFromDb = await this.companyService.findOne({
                _id: company,
                partner: partner,
            });
            if (!companyFromDb)
                throw new common_1.NotFoundException('Unknown company');
            return this.partnerUserService.userService.createUserInCognito(createPartnerUserDto, true, {
                userRole: Enums_1.SystemRoles.COMPANY,
                company: company,
            });
        }
        else {
            return await this.partnerUserService.userService.createUserInCognito(createPartnerUserDto, true, {
                userRole: Enums_1.SystemRoles.PARTNER,
                partner: partner,
            });
        }
    }
    async updatePartnerUser(partner, usernameOrSub, editPartnerUserDto) {
        const userFromDb = await this.partnerService.userService.getUserProfile(usernameOrSub);
        if (!userFromDb)
            throw new common_1.NotFoundException('User not found');
        const partnerFromDb = await this.partnerService.findById(partner);
        if (!partnerFromDb)
            throw new common_1.NotFoundException('Unknown partner');
        const updatedUser = await this.partnerService.userService.userModel.findByIdAndUpdate(userFromDb._id, Object.assign({}, editPartnerUserDto), { new: true });
        return updatedUser;
    }
    async disablePartnerUser(partner, usernameOrSub) {
        const userFromDb = await this.partnerService.userService.getUserProfile(usernameOrSub);
        if (!userFromDb)
            throw new common_1.NotFoundException('User not found');
        const partnerFromDb = await this.partnerService.findById(partner);
        if (!partnerFromDb)
            throw new common_1.NotFoundException('Unknown partner');
        await this.partnerService.userService.adminDisableUser(userFromDb.username);
        const updatedUser = await this.partnerService.userService.userModel.findByIdAndUpdate(userFromDb._id, {
            enabled: false,
        }, { new: true });
        return updatedUser;
    }
    async enablePartnerUser(partner, usernameOrSub) {
        const userFromDb = await this.partnerService.userService.getUserProfile(usernameOrSub);
        if (!userFromDb)
            throw new common_1.NotFoundException('User not found');
        const partnerFromDb = await this.partnerService.findById(partner);
        if (!partnerFromDb)
            throw new common_1.NotFoundException('Unknown partner');
        await this.partnerService.userService.adminEnableUser(userFromDb.username);
        const updatedUser = await this.partnerService.userService.userModel.findByIdAndUpdate(userFromDb._id, {
            enabled: true,
        }, { new: true });
        return updatedUser;
    }
};
__decorate([
    common_1.Put('/change-admin-user'),
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
    __param(1, common_1.Body('user')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PartnerUserController.prototype, "changeAdminUser", null);
__decorate([
    common_1.Post('/create-partner-user'),
    swagger_1.ApiOperation({
        summary: 'Create partner user can also be company user id company field is present',
    }),
    __param(0, common_1.Param('partner')),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, partner_user_1.CreatePartnerUserDto]),
    __metadata("design:returntype", Promise)
], PartnerUserController.prototype, "createUser", null);
__decorate([
    common_1.Put('/update-partner-user/:usernameOrSub'),
    swagger_1.ApiOperation({ summary: 'Update partner user' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, common_1.Param('partner')),
    __param(1, common_1.Param('usernameOrSub')),
    __param(2, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, partner_user_1.EditPartnerUserDto]),
    __metadata("design:returntype", Promise)
], PartnerUserController.prototype, "updatePartnerUser", null);
__decorate([
    common_1.Put('/disable-user/:usernameOrSub'),
    swagger_1.ApiOperation({ summary: 'Disable partner user' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, common_1.Param('partner')),
    __param(1, common_1.Param('usernameOrSub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PartnerUserController.prototype, "disablePartnerUser", null);
__decorate([
    common_1.Put('/enable-user/:usernameOrSub'),
    swagger_1.ApiOperation({ summary: 'Disable partner user' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, common_1.Param('partner')),
    __param(1, common_1.Param('usernameOrSub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PartnerUserController.prototype, "enablePartnerUser", null);
PartnerUserController = __decorate([
    swagger_1.ApiTags('Partners Controller'),
    common_1.Controller('partners/:partner/users'),
    __metadata("design:paramtypes", [partner_service_1.PartnerService,
        company_service_1.CompanyService,
        partner_user_service_1.PartnerUserService])
], PartnerUserController);
exports.PartnerUserController = PartnerUserController;
//# sourceMappingURL=partner-user.controller.js.map