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
let PartnerController = class PartnerController {
    constructor(partnerService) {
        this.partnerService = partnerService;
    }
    async create(createPartnerDto) {
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
        return this.partnerService.create(createPartnerDto);
    }
    findAll(queryDto) {
        return this.partnerService.findAll(queryDto);
    }
    findById(id) {
        return this.partnerService.findById(id);
    }
    async changeAdminUser(partner, user) {
        const userFromDb = await this.partnerService.userService.getUserProfile(user);
        if (!userFromDb)
            throw new common_1.NotFoundException('Unknown user');
        if (userFromDb.adminPartner) {
            throw new common_1.UnprocessableEntityException('Given user already own the partner, please choose different user as a partner admin');
        }
        const partnerFromDb = await this.partnerService.findById(partner);
        if (!partnerFromDb)
            throw new common_1.NotFoundException('Unknown partner');
        return this.partnerService.makePartnerAdminUser(user, partner);
    }
    update(id, updatePartnerDto) {
        return this.partnerService.update(id, updatePartnerDto);
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
    common_1.Post(),
    swagger_1.ApiOperation({ summary: 'Create partner' }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_partner_dto_1.CreatePartnerDto]),
    __metadata("design:returntype", Promise)
], PartnerController.prototype, "create", null);
__decorate([
    swagger_1.ApiOperation({
        summary: 'Get partners',
    }),
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
    common_1.Get(':id'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PartnerController.prototype, "findById", null);
__decorate([
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
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PartnerController.prototype, "changeAdminUser", null);
__decorate([
    swagger_1.ApiOperation({
        summary: 'Update partner by id',
    }),
    common_1.Put(':id'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, common_1.Param('id')),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_partner_dto_1.UpdatePartnerDto]),
    __metadata("design:returntype", void 0)
], PartnerController.prototype, "update", null);
__decorate([
    common_1.Get('/count'),
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
    swagger_1.ApiOperation({
        summary: 'Get all count of all partners',
    }),
    openapi.ApiResponse({ status: 200, type: Number }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PartnerController.prototype, "getEstimateCount", null);
__decorate([
    common_1.Delete(':id'),
    swagger_1.ApiOperation({ summary: 'Remove partner' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PartnerController.prototype, "remove", null);
PartnerController = __decorate([
    swagger_1.ApiTags('Partners Controller'),
    common_1.Controller('partners'),
    __metadata("design:paramtypes", [partner_service_1.PartnerService])
], PartnerController);
exports.PartnerController = PartnerController;
//# sourceMappingURL=partner.controller.js.map