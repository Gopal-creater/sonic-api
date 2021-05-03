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
let ApiKeyAuthGuard = class ApiKeyAuthGuard {
    constructor(apiKeyService) {
        this.apiKeyService = apiKeyService;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const apikey = request.headers['x-api-key'];
        if (!apikey)
            throw new common_1.ForbiddenException("Forbidden resource deuto no apikey");
        const apikeyFromDb = await this.apiKeyService.apiKeyModel.findById(apikey)
            .catch(err => { throw new common_1.ForbiddenException("Forbidden resource deuto invalid apikey"); });
        if (!apikeyFromDb)
            throw new common_1.ForbiddenException("Forbidden resource deuto invalid apikey");
        if (apikeyFromDb.disabled || apikeyFromDb.disabledByAdmin)
            throw new common_1.ForbiddenException("Forbidden resource deuto no apikey is disabled");
        if (new Date(apikeyFromDb.validity).getTime() < new Date().getTime())
            throw new common_1.ForbiddenException("Forbidden resource deuto no apikey is expired");
        request.apikey = apikeyFromDb;
        return true;
    }
};
ApiKeyAuthGuard = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [api_key_service_1.ApiKeyService])
], ApiKeyAuthGuard);
exports.ApiKeyAuthGuard = ApiKeyAuthGuard;
//# sourceMappingURL=i.guard.js.map