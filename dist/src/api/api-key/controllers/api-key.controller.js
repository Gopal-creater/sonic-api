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
let ApiKeyController = class ApiKeyController {
    constructor(apiKeyService) {
        this.apiKeyService = apiKeyService;
    }
    async create(createApiKeyDto) {
        var _a;
        console.log("createApiKeyDto", createApiKeyDto);
        if (createApiKeyDto.type == Enums_1.ApiKeyType.INDIVIDUAL) {
            const user = await this.apiKeyService.userService.getUserProfile(createApiKeyDto.customer);
            if (!user)
                throw new common_1.NotFoundException("Unknown user");
            createApiKeyDto.customer = user === null || user === void 0 ? void 0 : user.sub;
        }
        else if (createApiKeyDto.type == Enums_1.ApiKeyType.GROUP) {
            const group = await this.apiKeyService.userService.getGroup((_a = createApiKeyDto.groups) === null || _a === void 0 ? void 0 : _a[0]);
            if (!group)
                throw new common_1.NotFoundException("Unknown group");
        }
        return this.apiKeyService.create(createApiKeyDto);
    }
    findAll(queryDto) {
        console.log("Query", queryDto);
        return this.apiKeyService.findAll(queryDto);
    }
    async getCount(queryDto) {
        const filter = queryDto.filter || {};
        return this.apiKeyService.apiKeyModel.where(filter).countDocuments();
    }
    async findOne(id) {
        const apiKey = await this.apiKeyService.apiKeyModel.findById(id);
        if (!apiKey) {
            throw new common_1.NotFoundException();
        }
        return apiKey;
    }
    async update(id, updateApiKeyDto) {
        const updatedApiKey = await this.apiKeyService.apiKeyModel.findOneAndUpdate({ _id: id }, updateApiKeyDto, { new: true });
        if (!updatedApiKey) {
            throw new common_1.NotFoundException();
        }
        return updatedApiKey;
    }
    async remove(id) {
        return this.apiKeyService.removeById(id).catch(err => {
            if (err.status == 404) {
                throw new common_1.NotFoundException();
            }
            throw err;
        });
    }
};
__decorate([
    common_1.Post(),
    roles_decorator_1.RolesAllowed(Enums_1.Roles.ADMIN),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard, role_based_guard_1.RoleBasedGuard),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({ summary: 'Create Api Key' }),
    openapi.ApiResponse({ status: 201, type: require("../schemas/api-key.schema").ApiKey }),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_api_key_dto_1.AdminCreateApiKeyDto]),
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
    common_1.Get('/count'),
    roles_decorator_1.RolesAllowed(Enums_1.Roles.ADMIN),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard, role_based_guard_1.RoleBasedGuard),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({ summary: 'Get count of all api-keys also accept filter as query params' }),
    openapi.ApiResponse({ status: 200, type: Number }),
    __param(0, common_1.Query(new parseQueryValue_pipe_1.ParseQueryValue())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [parsedquery_dto_1.ParsedQueryDto]),
    __metadata("design:returntype", Promise)
], ApiKeyController.prototype, "getCount", null);
__decorate([
    common_1.Get(':id'),
    roles_decorator_1.RolesAllowed(Enums_1.Roles.ADMIN),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard, role_based_guard_1.RoleBasedGuard),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({ summary: 'Get Single Api key' }),
    openapi.ApiResponse({ status: 200, type: require("../schemas/api-key.schema").ApiKey }),
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
    openapi.ApiResponse({ status: 200, type: require("../schemas/api-key.schema").ApiKey }),
    __param(0, common_1.Param('id')),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_api_key_dto_1.UpdateApiKeyDto]),
    __metadata("design:returntype", Promise)
], ApiKeyController.prototype, "update", null);
__decorate([
    common_1.Delete(':id'),
    roles_decorator_1.RolesAllowed(Enums_1.Roles.ADMIN),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard, role_based_guard_1.RoleBasedGuard),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({ summary: 'Delete Api key' }),
    openapi.ApiResponse({ status: 200, type: require("../schemas/api-key.schema").ApiKey }),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ApiKeyController.prototype, "remove", null);
ApiKeyController = __decorate([
    swagger_1.ApiTags('Apikey Management Controller'),
    common_1.Controller({
        path: 'api-keys'
    }),
    __metadata("design:paramtypes", [api_key_service_1.ApiKeyService])
], ApiKeyController);
exports.ApiKeyController = ApiKeyController;
//# sourceMappingURL=api-key.controller.js.map