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
exports.ApiKeyCustomerController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const api_key_service_1 = require("../api-key.service");
const create_api_key_dto_1 = require("../dto/create-api-key.dto");
const update_api_key_dto_1 = require("../dto/update-api-key.dto");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const swagger_1 = require("@nestjs/swagger");
const parseQueryValue_pipe_1 = require("../../../shared/pipes/parseQueryValue.pipe");
const isTargetUserLoggedIn_guard_1 = require("../../auth/guards/isTargetUserLoggedIn.guard");
const parsedquery_dto_1 = require("../../../shared/dtos/parsedquery.dto");
const anyapiquerytemplate_decorator_1 = require("../../../shared/decorators/anyapiquerytemplate.decorator");
let ApiKeyCustomerController = class ApiKeyCustomerController {
    constructor(apiKeyService) {
        this.apiKeyService = apiKeyService;
    }
    create(customer, createApiKeyDto) {
        const newApiKey = new this.apiKeyService.apiKeyModel(Object.assign(Object.assign({}, createApiKeyDto), { customer: customer }));
        return newApiKey.save();
    }
    async findAll(customer, queryDto) {
        queryDto.filter["customer"] = customer;
        return this.apiKeyService.findAll(queryDto);
    }
    async findOne(customer, apikey) {
        const apiKey = await this.apiKeyService.apiKeyModel.findById(apikey);
        if (!apiKey) {
            throw new common_1.NotFoundException();
        }
        if (apiKey.customer !== customer) {
            throw new common_1.BadRequestException('You are not the owner of this api key');
        }
        return apiKey;
    }
    async update(customer, apikey, updateApiKeyDto) {
        const apiKey = await this.apiKeyService.apiKeyModel.findById(apikey);
        if (!apiKey) {
            throw new common_1.NotFoundException();
        }
        if (apiKey.customer !== customer) {
            throw new common_1.BadRequestException('You are not the owner of this api key');
        }
        return this.apiKeyService.apiKeyModel.findOneAndUpdate({ _id: apikey }, updateApiKeyDto, { new: true });
    }
    async makeDiabled(customer, apikey) {
        const apiKey = await this.apiKeyService.apiKeyModel.findById(apikey);
        if (!apiKey) {
            throw new common_1.NotFoundException();
        }
        if (apiKey.customer !== customer) {
            throw new common_1.BadRequestException('You are not the owner of this api key');
        }
        return this.apiKeyService.makeEnableDisable(apikey, true);
    }
    async makeEnabled(customer, apikey) {
        const apiKey = await this.apiKeyService.apiKeyModel.findById(apikey);
        if (!apiKey) {
            throw new common_1.NotFoundException();
        }
        if (apiKey.customer !== customer) {
            throw new common_1.BadRequestException('You are not the owner of this api key');
        }
        return this.apiKeyService.makeEnableDisable(apikey, false);
    }
    async remove(customer, apikey) {
        const apiKey = await this.apiKeyService.apiKeyModel.findById(apikey);
        if (!apiKey) {
            throw new common_1.NotFoundException();
        }
        if (apiKey.customer !== customer) {
            throw new common_1.BadRequestException('You are not the owner of this api key');
        }
        return this.apiKeyService.removeById(apikey);
    }
};
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, new isTargetUserLoggedIn_guard_1.IsTargetUserLoggedInGuard('Param')),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create Api Key' }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Param)('targetUser')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_api_key_dto_1.CreateApiKeyDto]),
    __metadata("design:returntype", void 0)
], ApiKeyCustomerController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, new isTargetUserLoggedIn_guard_1.IsTargetUserLoggedInGuard('Param')),
    (0, swagger_1.ApiBearerAuth)(),
    (0, anyapiquerytemplate_decorator_1.AnyApiQueryTemplate)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get All ApiKeys' }),
    openapi.ApiResponse({ status: 200, type: require("../dto/mongoosepaginate-apikey.dto").MongoosePaginateApiKeyDto }),
    __param(0, (0, common_1.Param)('targetUser')),
    __param(1, (0, common_1.Query)(new parseQueryValue_pipe_1.ParseQueryValue())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, parsedquery_dto_1.ParsedQueryDto]),
    __metadata("design:returntype", Promise)
], ApiKeyCustomerController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':apikey'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, new isTargetUserLoggedIn_guard_1.IsTargetUserLoggedInGuard('Param')),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get Single Api key' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('targetUser')),
    __param(1, (0, common_1.Param)('apikey')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ApiKeyCustomerController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':apikey'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, new isTargetUserLoggedIn_guard_1.IsTargetUserLoggedInGuard('Param')),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update Single Api key' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('targetUser')),
    __param(1, (0, common_1.Param)('apikey')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, update_api_key_dto_1.UpdateApiKeyDto]),
    __metadata("design:returntype", Promise)
], ApiKeyCustomerController.prototype, "update", null);
__decorate([
    (0, common_1.Put)(':apikey/make-disabled'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, new isTargetUserLoggedIn_guard_1.IsTargetUserLoggedInGuard('Param')),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Make this key disabled' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('targetUser')),
    __param(1, (0, common_1.Param)('apikey')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ApiKeyCustomerController.prototype, "makeDiabled", null);
__decorate([
    (0, common_1.Put)(':apikey/make-enabled'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, new isTargetUserLoggedIn_guard_1.IsTargetUserLoggedInGuard('Param')),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Make this key enabled' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('targetUser')),
    __param(1, (0, common_1.Param)('apikey')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ApiKeyCustomerController.prototype, "makeEnabled", null);
__decorate([
    (0, common_1.Delete)(':apikey'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, new isTargetUserLoggedIn_guard_1.IsTargetUserLoggedInGuard('Param')),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Delete Api key' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('targetUser')),
    __param(1, (0, common_1.Param)('apikey')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ApiKeyCustomerController.prototype, "remove", null);
ApiKeyCustomerController = __decorate([
    (0, swagger_1.ApiTags)('Apikey-Customer Management Controller'),
    (0, common_1.Controller)('api-keys/customers/:targetUser'),
    __metadata("design:paramtypes", [api_key_service_1.ApiKeyService])
], ApiKeyCustomerController);
exports.ApiKeyCustomerController = ApiKeyCustomerController;
//# sourceMappingURL=api-key-customer.controller.js.map