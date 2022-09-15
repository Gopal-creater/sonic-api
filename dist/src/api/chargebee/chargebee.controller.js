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
exports.ChargebeeController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const chargebee_service_1 = require("./chargebee.service");
const swagger_1 = require("@nestjs/swagger");
const subscription_dto_1 = require("./dto/subscription.dto");
let ChargebeeController = class ChargebeeController {
    constructor(chargebeeService) {
        this.chargebeeService = chargebeeService;
    }
    findPlans() {
        return this.chargebeeService.findPlans();
    }
    webHook(data) {
        console.log('data', data);
        return 'done';
    }
    getPlanPrice(plan) {
        return this.chargebeeService.getPlanPrice(plan);
    }
    getHostedPage(data) {
        return this.chargebeeService.getHostedPage_NewSubscription(data);
    }
    getHostedPageForAddon() {
        return this.chargebeeService.getHostedPageForAddon();
    }
    getHostedPageForUpgrade() {
        return this.chargebeeService.getHostedPageForUpgrade();
    }
};
__decorate([
    (0, common_1.Get)('/plans'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ChargebeeController.prototype, "findPlans", null);
__decorate([
    (0, common_1.Post)('/webhook'),
    openapi.ApiResponse({ status: 201, type: String }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ChargebeeController.prototype, "webHook", null);
__decorate([
    (0, common_1.Get)('/plans/:id/get-price'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ChargebeeController.prototype, "getPlanPrice", null);
__decorate([
    (0, common_1.Post)('/plans/get-hosted-page'),
    (0, swagger_1.ApiOperation)({ summary: 'Generates checkout page for new subscription.' }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [subscription_dto_1.SubscriptionDto]),
    __metadata("design:returntype", void 0)
], ChargebeeController.prototype, "getHostedPage", null);
__decorate([
    (0, common_1.Get)('/plans/get-hosted-page-for-addon'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ChargebeeController.prototype, "getHostedPageForAddon", null);
__decorate([
    (0, common_1.Get)('/plans/get-hosted-page-for-upgrade'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ChargebeeController.prototype, "getHostedPageForUpgrade", null);
ChargebeeController = __decorate([
    (0, swagger_1.ApiTags)('Chargebee'),
    (0, common_1.Controller)('chargebee'),
    __metadata("design:paramtypes", [chargebee_service_1.ChargebeeService])
], ChargebeeController);
exports.ChargebeeController = ChargebeeController;
//# sourceMappingURL=chargebee.controller.js.map