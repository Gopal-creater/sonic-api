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
exports.PaymentController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const payment_service_1 = require("../services/payment.service");
const create_payment_dto_1 = require("../dto/create-payment.dto");
const swagger_1 = require("@nestjs/swagger");
const plan_service_1 = require("../../plan/plan.service");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const user_decorator_1 = require("../../auth/decorators/user.decorator");
const licensekey_service_1 = require("../../licensekey/services/licensekey.service");
const plan_schema_1 = require("../../plan/schemas/plan.schema");
const Enums_1 = require("../../../constants/Enums");
let PaymentController = class PaymentController {
    constructor(paymentService, planService, licenseKeyService) {
        this.paymentService = paymentService;
        this.planService = planService;
        this.licenseKeyService = licenseKeyService;
    }
    async buyPlan(buyPlanDto, user) {
        const { plan } = buyPlanDto;
        const planFromDb = await this.planService.findById(plan);
        if (!planFromDb) {
            throw new common_1.NotFoundException('Invalid plan selected, Plan not found');
        }
        const isSamePlan = await this.licenseKeyService.findOne({
            users: user,
            activePlan: plan
        });
        if (isSamePlan) {
            throw new common_1.BadRequestException('Can not select your active plan');
        }
        return this.paymentService.buyPlan(user, buyPlanDto);
    }
    async upgradePlan(upgradePlanDto, user) {
        const { upgradedPlan } = upgradePlanDto;
        const planFromDb = await this.planService.findById(upgradedPlan);
        if (!planFromDb) {
            throw new common_1.NotFoundException('Invalid plan selected, Plan not found');
        }
        const isSamePlan = await this.licenseKeyService.findOne({
            users: user,
            activePlan: upgradedPlan
        });
        if (isSamePlan) {
            throw new common_1.BadRequestException('Can not select your active plan');
        }
        return this.paymentService.upgradePlan(user, upgradePlanDto);
    }
    async buyExtraKeys(buyExtraKeysForExistingPlanDto, user) {
        const { oldPlanLicenseKey, extraKeys } = buyExtraKeysForExistingPlanDto;
        const oldPlanLicenseKeyFromDb = await this.licenseKeyService.findOne({ key: oldPlanLicenseKey });
        if (!oldPlanLicenseKeyFromDb) {
            throw new common_1.NotFoundException('Invalid old plan selected, Old plan not found');
        }
        const activePlan = oldPlanLicenseKeyFromDb === null || oldPlanLicenseKeyFromDb === void 0 ? void 0 : oldPlanLicenseKeyFromDb.activePlan;
        if (activePlan.type !== Enums_1.PlanType.ENCODE) {
            throw new common_1.NotFoundException('Invalid old plan selected, Old plan not found');
        }
        if ((oldPlanLicenseKeyFromDb.maxEncodeUses + extraKeys) > activePlan.limitedSonicKeys) {
            throw new common_1.BadRequestException(`Maximum sonickeys limit reached on this plan,available limit value is : ${activePlan.limitedSonicKeys - oldPlanLicenseKeyFromDb.maxEncodeUses}`);
        }
        return this.paymentService.buyExtraKeysForPlan(user, buyExtraKeysForExistingPlanDto);
    }
};
__decorate([
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    swagger_1.ApiBearerAuth(),
    common_1.Post('/buy-plan'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, common_1.Body()),
    __param(1, user_decorator_1.User('sub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_payment_dto_1.BuyPlanDto, String]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "buyPlan", null);
__decorate([
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    swagger_1.ApiBearerAuth(),
    common_1.Put('/upgrade-plan'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, common_1.Body()),
    __param(1, user_decorator_1.User('sub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_payment_dto_1.UpgradePlanDto, String]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "upgradePlan", null);
__decorate([
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    swagger_1.ApiBearerAuth(),
    common_1.Put('/buy-extra-sonickeys'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, common_1.Body()),
    __param(1, user_decorator_1.User('sub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_payment_dto_1.BuyExtraKeysForExistingPlanDto, String]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "buyExtraKeys", null);
PaymentController = __decorate([
    swagger_1.ApiTags('Subscription Controller'),
    common_1.Controller('subscriptions/owners/:ownerId'),
    __metadata("design:paramtypes", [payment_service_1.PaymentService,
        plan_service_1.PlanService,
        licensekey_service_1.LicensekeyService])
], PaymentController);
exports.PaymentController = PaymentController;
//# sourceMappingURL=subscription-owner.controller.js.map