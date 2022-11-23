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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiKeyAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const api_key_service_1 = require("../../api-key/api-key.service");
const user_service_1 = require("../../user/services/user.service");
const Enums_1 = require("../../../constants/Enums");
const company_service_1 = require("../../company/company.service");
let ApiKeyAuthGuard = class ApiKeyAuthGuard {
    constructor(apiKeyService, userService, companyService) {
        this.apiKeyService = apiKeyService;
        this.userService = userService;
        this.companyService = companyService;
    }
    async canActivate(context) {
        var _a, _b, _c;
        const request = context.switchToHttp().getRequest();
        const apikey = request.headers['x-api-key'];
        if (!apikey)
            throw new common_1.ForbiddenException('Forbidden resource deuto no apikey');
        const apikeyFromDb = await this.apiKeyService
            .findById(apikey)
            .catch(err => {
            throw new common_1.ForbiddenException('Forbidden resource deuto invalid apikey');
        });
        if (!apikeyFromDb)
            throw new common_1.ForbiddenException('Forbidden resource deuto invalid apikey');
        if (apikeyFromDb.revoked)
            throw new common_1.ForbiddenException('This api key is revoked');
        if (apikeyFromDb.disabled || apikeyFromDb.suspended)
            throw new common_1.ForbiddenException('Forbidden resource deuto apikey is disabled or suspended');
        if (new Date(apikeyFromDb.validity).getTime() < new Date().getTime())
            throw new common_1.ForbiddenException('Forbidden resource deuto apikey is expired');
        var ownerUser;
        if (apikeyFromDb.type == Enums_1.ApiKeyType.INDIVIDUAL) {
            ownerUser = await this.userService.getUserProfile((_a = apikeyFromDb === null || apikeyFromDb === void 0 ? void 0 : apikeyFromDb.customer) === null || _a === void 0 ? void 0 : _a.sub);
        }
        else if (apikeyFromDb.type == Enums_1.ApiKeyType.COMPANY) {
            const ownerCompany = await this.companyService.findById((_b = apikeyFromDb === null || apikeyFromDb === void 0 ? void 0 : apikeyFromDb.company) === null || _b === void 0 ? void 0 : _b._id);
            if (!ownerCompany)
                throw new common_1.ForbiddenException('Company not found for this apikey');
            ownerUser = await this.userService.findOne({ _id: (_c = ownerCompany === null || ownerCompany === void 0 ? void 0 : ownerCompany.owner) === null || _c === void 0 ? void 0 : _c._id });
        }
        if (!ownerUser)
            throw new common_1.ForbiddenException('Admin user not found for this apikey');
        request.user = ownerUser;
        request.apikey = apikeyFromDb;
        return true;
    }
};
ApiKeyAuthGuard = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [api_key_service_1.ApiKeyService,
        user_service_1.UserService,
        company_service_1.CompanyService])
], ApiKeyAuthGuard);
exports.ApiKeyAuthGuard = ApiKeyAuthGuard;
//# sourceMappingURL=apikey-auth.guard.js.map