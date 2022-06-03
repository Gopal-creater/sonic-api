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
exports.ApiKeyController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const api_key_service_1 = require("../api-key.service");
const create_api_key_dto_1 = require("../dto/create-api-key.dto");
const update_api_key_dto_1 = require("../dto/update-api-key.dto");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const swagger_1 = require("@nestjs/swagger");
const parseQueryValue_pipe_1 = require("../../../shared/pipes/parseQueryValue.pipe");
const parsedquery_dto_1 = require("../../../shared/dtos/parsedquery.dto");
const anyapiquerytemplate_decorator_1 = require("../../../shared/decorators/anyapiquerytemplate.decorator");
const roles_decorator_1 = require("../../auth/decorators/roles.decorator");
const Enums_1 = require("../../../constants/Enums");
const role_based_guard_1 = require("../../auth/guards/role-based.guard");
const decorators_1 = require("../../auth/decorators");
const user_db_schema_1 = require("../../user/schemas/user.db.schema");
const api_key_schema_1 = require("../schemas/api-key.schema");
let ApiKeyController = class ApiKeyController {
    constructor(apiKeyService) {
        this.apiKeyService = apiKeyService;
    }
    async create(loggedInUser, createApiKeyDto) {
        var _a;
        const doc = Object.assign(Object.assign({}, createApiKeyDto), { createdBy: loggedInUser === null || loggedInUser === void 0 ? void 0 : loggedInUser.sub });
        if (createApiKeyDto.type == Enums_1.ApiKeyType.INDIVIDUAL) {
            const user = await this.apiKeyService.userService.getUserProfile(createApiKeyDto.customer);
            if (!user)
                throw new common_1.NotFoundException('Unknown user');
        }
        else if (createApiKeyDto.type == Enums_1.ApiKeyType.COMPANY) {
            const company = await this.apiKeyService.companyService.findById(createApiKeyDto.company);
            if (!company)
                throw new common_1.NotFoundException('Unknown company');
            if (!((_a = company === null || company === void 0 ? void 0 : company.owner) === null || _a === void 0 ? void 0 : _a.sub))
                throw new common_1.NotFoundException('The given company doesnot have any valid admin user');
            doc.customer = company.owner.sub;
        }
        return this.apiKeyService.create(doc);
    }
    findAll(queryDto) {
        return this.apiKeyService.findAll(queryDto);
    }
    async findOne(id) {
        const apiKey = await this.apiKeyService.findById(id);
        if (!apiKey) {
            throw new common_1.NotFoundException();
        }
        return apiKey;
    }
    async update(id, updateApiKeyDto, updatedBy) {
        const apiKey = await this.apiKeyService.findById(id);
        if (!apiKey) {
            throw new common_1.NotFoundException();
        }
        const updatedKey = await this.apiKeyService.update(id, Object.assign(Object.assign({}, updateApiKeyDto), { updatedBy: updatedBy }));
        return updatedKey;
    }
    async getCount(queryDto) {
        return this.apiKeyService.getCount(queryDto);
    }
    async getEstimateCount() {
        return this.apiKeyService.getEstimateCount();
    }
    async remove(id) {
        const apiKey = await this.apiKeyService.findById(id);
        if (!apiKey) {
            throw new common_1.NotFoundException();
        }
        return this.apiKeyService.removeById(id);
    }
};
__decorate([
    common_1.Post(),
    roles_decorator_1.RolesAllowed(Enums_1.Roles.ADMIN),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard, role_based_guard_1.RoleBasedGuard),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({ summary: 'Create Api Key' }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, decorators_1.User()),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_db_schema_1.UserDB, create_api_key_dto_1.AdminCreateApiKeyDto]),
    __metadata("design:returntype", Promise)
], ApiKeyController.prototype, "create", null);
__decorate([
    common_1.Get(),
    roles_decorator_1.RolesAllowed(Enums_1.Roles.ADMIN),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard, role_based_guard_1.RoleBasedGuard),
    swagger_1.ApiBearerAuth(),
    anyapiquerytemplate_decorator_1.AnyApiQueryTemplate(),
    swagger_1.ApiOperation({ summary: 'Get All ApiKeys' }),
    openapi.ApiResponse({ status: 200, type: require("../dto/mongoosepaginate-apikey.dto").MongoosePaginateApiKeyDto }),
    __param(0, common_1.Query(new parseQueryValue_pipe_1.ParseQueryValue())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [parsedquery_dto_1.ParsedQueryDto]),
    __metadata("design:returntype", void 0)
], ApiKeyController.prototype, "findAll", null);
__decorate([
    common_1.Get(':id'),
    roles_decorator_1.RolesAllowed(Enums_1.Roles.ADMIN),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard, role_based_guard_1.RoleBasedGuard),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({ summary: 'Get Single Api key' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ApiKeyController.prototype, "findOne", null);
__decorate([
    common_1.Put(':id'),
    roles_decorator_1.RolesAllowed(Enums_1.Roles.ADMIN),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard, role_based_guard_1.RoleBasedGuard),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({ summary: 'Update Single Api key' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, common_1.Param('id')),
    __param(1, common_1.Body()),
    __param(2, decorators_1.User('sub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_api_key_dto_1.UpdateApiKeyDto, String]),
    __metadata("design:returntype", Promise)
], ApiKeyController.prototype, "update", null);
__decorate([
    common_1.Get('/count'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    anyapiquerytemplate_decorator_1.AnyApiQueryTemplate(),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({
        summary: 'Get count of all apikeys also accept filter as query params',
    }),
    openapi.ApiResponse({ status: 200, type: Number }),
    __param(0, common_1.Query(new parseQueryValue_pipe_1.ParseQueryValue())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [parsedquery_dto_1.ParsedQueryDto]),
    __metadata("design:returntype", Promise)
], ApiKeyController.prototype, "getCount", null);
__decorate([
    common_1.Get('/estimate-count'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({
        summary: 'Get all count of all apikeys',
    }),
    openapi.ApiResponse({ status: 200, type: Number }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ApiKeyController.prototype, "getEstimateCount", null);
__decorate([
    common_1.Delete(':id'),
    roles_decorator_1.RolesAllowed(Enums_1.Roles.ADMIN),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard, role_based_guard_1.RoleBasedGuard),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({ summary: 'Delete Api key' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ApiKeyController.prototype, "remove", null);
ApiKeyController = __decorate([
    swagger_1.ApiTags('Apikey Management Controller'),
    common_1.Controller({
        path: 'api-keys',
    }),
    __metadata("design:paramtypes", [api_key_service_1.ApiKeyService])
], ApiKeyController);
exports.ApiKeyController = ApiKeyController;
//# sourceMappingURL=api-key.controller.js.map