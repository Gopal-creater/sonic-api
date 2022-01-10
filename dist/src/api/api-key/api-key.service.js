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
let ApiKeyService = class ApiKeyService {
    constructor(apiKeyModel, userService) {
        this.apiKeyModel = apiKeyModel;
        this.userService = userService;
    }
    create(createApiKeyDto) {
        const newApiKey = new this.apiKeyModel(createApiKeyDto);
        return newApiKey.save();
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
    __metadata("design:paramtypes", [mongoose_2.Model,
        user_service_1.UserService])
], ApiKeyService);
exports.ApiKeyService = ApiKeyService;
//# sourceMappingURL=api-key.service.js.map