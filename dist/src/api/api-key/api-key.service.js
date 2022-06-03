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
exports.ApiKeyService = void 0;
const common_1 = require("@nestjs/common");
const api_key_schema_1 = require("./schemas/api-key.schema");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_service_1 = require("../user/services/user.service");
const company_service_1 = require("../company/company.service");
const Enums_1 = require("../../constants/Enums");
let ApiKeyService = class ApiKeyService {
    constructor(apiKeyModel, userService, companyService) {
        this.apiKeyModel = apiKeyModel;
        this.userService = userService;
        this.companyService = companyService;
    }
    async create(doc) {
        const newApiKey = await this.apiKeyModel.create(Object.assign({}, doc));
        return newApiKey.save();
    }
    async findOrCreateApiKeyForCompanyUser(user, createdBy) {
        var now = new Date();
        var startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        var apiKey = await this.apiKeyModel.findOne({
            customer: user,
            type: Enums_1.ApiKeyType.INDIVIDUAL,
            disabled: false,
            revoked: false,
            suspended: false,
            validity: { $gte: startOfToday },
        });
        if (!apiKey) {
            apiKey = await this.createDefaultApiKeyForCompanyUser(user, createdBy);
        }
        return apiKey;
    }
    async findOrCreateApiKeyForCompany(user, company, createdBy) {
        var now = new Date();
        var startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        var apiKey = await this.apiKeyModel.findOne({
            company: company,
            type: Enums_1.ApiKeyType.COMPANY,
            disabled: false,
            revoked: false,
            suspended: false,
            validity: { $gte: startOfToday },
        });
        if (!apiKey) {
            apiKey = await this.createDefaultApiKeyForCompany(user, company, createdBy);
        }
        return apiKey;
    }
    async createDefaultApiKeyForCompanyUser(user, createdBy) {
        const newLicenseKey = await this.apiKeyModel.create({
            customer: user,
            type: Enums_1.ApiKeyType.INDIVIDUAL,
            validity: new Date(new Date().setMonth(new Date().getMonth() + 7)),
            createdBy: createdBy || 'system_generate'
        });
        return newLicenseKey.save();
    }
    async createDefaultApiKeyForCompany(user, company, createdBy) {
        const newLicenseKey = await this.apiKeyModel.create({
            customer: user,
            company: company,
            type: Enums_1.ApiKeyType.COMPANY,
            validity: new Date(new Date().setMonth(new Date().getMonth() + 7)),
            createdBy: createdBy || 'system_generate'
        });
        return newLicenseKey.save();
    }
    async makeEnableDisable(id, disabled) {
        const oldApiKey = await this.apiKeyModel.findById(id);
        if (!oldApiKey) {
            return Promise.reject({
                notFound: true,
                status: 404,
                message: 'Item not found',
            });
        }
        if (oldApiKey.suspended) {
            throw new common_1.UnprocessableEntityException("Your key is suspended, please contact your admin.");
        }
        return this.apiKeyModel.findOneAndUpdate({ _id: id }, {
            disabled: disabled
        }, { new: true });
    }
    async findAll(queryDto) {
        const { limit, skip, sort, page, filter, select, populate } = queryDto;
        var paginateOptions = {};
        paginateOptions['sort'] = sort;
        paginateOptions['select'] = select;
        paginateOptions['populate'] = populate;
        paginateOptions['offset'] = skip;
        paginateOptions['page'] = page;
        paginateOptions['limit'] = limit;
        return await this.apiKeyModel["paginate"](filter, paginateOptions);
    }
    async getCount(queryDto) {
        const { filter, includeGroupData } = queryDto;
        return this.apiKeyModel
            .find(filter || {})
            .count();
    }
    findOne(filter) {
        return this.apiKeyModel.findOne(filter);
    }
    findById(id) {
        return this.apiKeyModel.findById(id);
    }
    update(id, updateApiKeyDto) {
        return this.apiKeyModel.findByIdAndUpdate(id, updateApiKeyDto, {
            new: true,
        });
    }
    async getEstimateCount() {
        return this.apiKeyModel.estimatedDocumentCount();
    }
    async removeById(id) {
        const apiKey = await this.apiKeyModel.findById(id);
        if (!apiKey) {
            return Promise.reject({
                notFound: true,
                status: 404,
                message: 'Item not found',
            });
        }
        return this.apiKeyModel.findByIdAndRemove(id);
    }
};
ApiKeyService = __decorate([
    common_1.Injectable(),
    __param(0, mongoose_1.InjectModel(api_key_schema_1.ApiKey.name)),
    __param(1, common_1.Inject(common_1.forwardRef(() => user_service_1.UserService))),
    __metadata("design:paramtypes", [mongoose_2.Model,
        user_service_1.UserService,
        company_service_1.CompanyService])
], ApiKeyService);
exports.ApiKeyService = ApiKeyService;
//# sourceMappingURL=api-key.service.js.map