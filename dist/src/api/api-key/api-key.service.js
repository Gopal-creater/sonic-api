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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiKeyService = void 0;
const common_1 = require("@nestjs/common");
const api_key_schema_1 = require("./schemas/api-key.schema");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let ApiKeyService = class ApiKeyService {
    constructor(apiKeyModel) {
        this.apiKeyModel = apiKeyModel;
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
        if (oldApiKey.disabledByAdmin) {
            throw new common_1.UnprocessableEntityException("Your key is disabled by admin, please contact your admin.");
        }
        return this.apiKeyModel.findOneAndUpdate({ _id: id }, {
            disabled: disabled
        }, { new: true });
    }
    async findAll(queryDto = {}) {
        var _a;
        const { _limit, _offset, _sort, _page } = queryDto, query = __rest(queryDto, ["_limit", "_offset", "_sort", "_page"]);
        var paginateOptions = {};
        var sort = {};
        if (_sort) {
            var sortItems = (_sort === null || _sort === void 0 ? void 0 : _sort.split(',')) || [];
            for (let index = 0; index < sortItems.length; index++) {
                const sortItem = sortItems[index];
                var sortKeyValue = sortItem === null || sortItem === void 0 ? void 0 : sortItem.split(':');
                sort[sortKeyValue[0]] =
                    ((_a = sortKeyValue[1]) === null || _a === void 0 ? void 0 : _a.toLowerCase()) == 'desc' ? -1 : 1;
            }
        }
        paginateOptions["sort"] = sort;
        paginateOptions["offset"] = _offset;
        paginateOptions["page"] = _page;
        paginateOptions["limit"] = _limit;
        return await this.apiKeyModel["paginate"](query, paginateOptions);
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
    __metadata("design:paramtypes", [mongoose_2.Model])
], ApiKeyService);
exports.ApiKeyService = ApiKeyService;
//# sourceMappingURL=api-key.service.js.map