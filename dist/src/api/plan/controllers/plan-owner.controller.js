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
exports.PlansOwnerController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const create_plan_dto_1 = require("../dto/create-plan.dto");
const swagger_1 = require("@nestjs/swagger");
const plan_service_1 = require("../plan.service");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const user_decorator_1 = require("../../auth/decorators/user.decorator");
const licensekey_service_1 = require("../../licensekey/services/licensekey.service");
const plan_schema_1 = require("../schemas/plan.schema");
const Enums_1 = require("../../../constants/Enums");
const parseQueryValue_pipe_1 = require("../../../shared/pipes/parseQueryValue.pipe");
const parsedquery_dto_1 = require("../../../shared/dtos/parsedquery.dto");
let PlansOwnerController = class PlansOwnerController {
    constructor(planService, licenseKeyService) {
        this.planService = planService;
        this.licenseKeyService = licenseKeyService;
    }
    async myPlans(user, ownerId, queryDto) {
        return this.planService.fetchMyPlans(user, queryDto);
    }
    async buyPlan(buyPlanDto, user, ownerId) {
        const { plan } = buyPlanDto;
        const planFromDb = await this.planService.findById(plan);
        if (!planFromDb) {
            throw new common_1.NotFoundException('Invalid plan selected, Plan not found');
        }
        const isSamePlan = await this.licenseKeyService.findOne({
            users: user,
            activePlan: plan,
        });
        if (isSamePlan) {
            throw new common_1.BadRequestException('Can not select your active plan');
        }
        return this.planService.buyPlan(user, buyPlanDto);
    }
    async upgradePlan(upgradePlanDto, user, ownerId) {
        const { upgradedPlan, oldPlanLicenseKey } = upgradePlanDto;
        const upgradedPlanFromDb = await this.planService.findById(upgradedPlan);
        if (!upgradedPlanFromDb) {
            throw new common_1.NotFoundException('Invalid plan selected, Plan not found');
        }
        const isSamePlan = await this.licenseKeyService.findOne({
            users: user,
            activePlan: upgradedPlan,
        });
        if (isSamePlan) {
            throw new common_1.BadRequestException('Can not select your active plan');
        }
        const planLicenseKey = await this.licenseKeyService.findOne({
            users: user,
            key: oldPlanLicenseKey,
        });
        if (!planLicenseKey) {
            throw new common_1.NotFoundException(`Your current plan is not found with given id ${oldPlanLicenseKey}`);
        }
        return this.planService.upgradePlan(user, upgradePlanDto);
    }
    async renewPlan(renewPlanDto, user, ownerId) {
        const { oldPlanLicenseKey } = renewPlanDto;
        const planLicenseKey = await this.licenseKeyService.findOne({
            users: user,
            key: oldPlanLicenseKey,
        });
        if (!planLicenseKey) {
            throw new common_1.NotFoundException(`Your current plan is not found with given id ${oldPlanLicenseKey}`);
        }
        var days = 5;
        var now = new Date();
        var fiveDaysBeforeToday = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
        if (!(new Date(planLicenseKey.validity).getTime() <
            fiveDaysBeforeToday.getTime())) {
            throw new common_1.UnprocessableEntityException(`Current plan can not be renewed right now, contact sonic admin`);
        }
        if (planLicenseKey.maxEncodeUses +
            planLicenseKey.activePlan.availableSonicKeys >
            planLicenseKey.activePlan.limitedSonicKeys) {
            throw new common_1.UnprocessableEntityException(`Current plan can not be renewed right now, contact sonic admin`);
        }
        return this.planService.renewPlan(user, renewPlanDto, planLicenseKey);
    }
    async buyExtraKeys(buyExtraKeysForExistingPlanDto, user, ownerId) {
        const { oldPlanLicenseKey, extraKeys } = buyExtraKeysForExistingPlanDto;
        const oldPlanLicenseKeyFromDb = await this.licenseKeyService.findOne({
            key: oldPlanLicenseKey,
        });
        if (!oldPlanLicenseKeyFromDb) {
            throw new common_1.NotFoundException('Invalid old plan selected, Old plan not found');
        }
        const activePlan = oldPlanLicenseKeyFromDb === null || oldPlanLicenseKeyFromDb === void 0 ? void 0 : oldPlanLicenseKeyFromDb.activePlan;
        if (activePlan.type !== Enums_1.PlanType.ENCODE) {
            throw new common_1.NotFoundException('Invalid old plan selected, Old plan not found');
        }
        if ((oldPlanLicenseKeyFromDb.maxEncodeUses -
            oldPlanLicenseKeyFromDb.oldMaxEncodeUses || 0) +
            extraKeys >
            activePlan.limitedSonicKeys) {
            throw new common_1.BadRequestException(`Maximum sonickeys limit reached on this plan,available limit value is : ${activePlan.limitedSonicKeys -
                (oldPlanLicenseKeyFromDb.maxEncodeUses -
                    oldPlanLicenseKeyFromDb.oldMaxEncodeUses || 0)}`);
        }
        return this.planService.buyExtraKeysForPlan(user, buyExtraKeysForExistingPlanDto);
    }
};
__decorate([
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    swagger_1.ApiBearerAuth(),
    common_1.Get('/my-plans'),
    openapi.ApiResponse({ status: 200, type: require("../../licensekey/dto/mongoosepaginate-licensekey.dto").MongoosePaginateLicensekeyDto }),
    __param(0, user_decorator_1.User('sub')),
    __param(1, common_1.Param('ownerId')),
    __param(2, common_1.Query(new parseQueryValue_pipe_1.ParseQueryValue())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, parsedquery_dto_1.ParsedQueryDto]),
    __metadata("design:returntype", Promise)
], PlansOwnerController.prototype, "myPlans", null);
__decorate([
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    swagger_1.ApiBearerAuth(),
    common_1.Post('/buy-plan'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, common_1.Body()),
    __param(1, user_decorator_1.User('sub')),
    __param(2, common_1.Param('ownerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_plan_dto_1.BuyPlanDto, String, String]),
    __metadata("design:returntype", Promise)
], PlansOwnerController.prototype, "buyPlan", null);
__decorate([
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    swagger_1.ApiBearerAuth(),
    common_1.Put('/upgrade-plan'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, common_1.Body()),
    __param(1, user_decorator_1.User('sub')),
    __param(2, common_1.Param('ownerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_plan_dto_1.UpgradePlanDto, String, String]),
    __metadata("design:returntype", Promise)
], PlansOwnerController.prototype, "upgradePlan", null);
__decorate([
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    swagger_1.ApiBearerAuth(),
    common_1.Put('/renew-plan'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, common_1.Body()),
    __param(1, user_decorator_1.User('sub')),
    __param(2, common_1.Param('ownerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_plan_dto_1.RenewPlanDto, String, String]),
    __metadata("design:returntype", Promise)
], PlansOwnerController.prototype, "renewPlan", null);
__decorate([
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    swagger_1.ApiBearerAuth(),
    common_1.Put('/buy-extra-sonickeys'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, common_1.Body()),
    __param(1, user_decorator_1.User('sub')),
    __param(2, common_1.Param('ownerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_plan_dto_1.BuyExtraKeysForExistingPlanDto, String, String]),
    __metadata("design:returntype", Promise)
], PlansOwnerController.prototype, "buyExtraKeys", null);
PlansOwnerController = __decorate([
    swagger_1.ApiTags('Plans Controller'),
    common_1.Controller('plans/owners/:ownerId'),
    __metadata("design:paramtypes", [plan_service_1.PlanService,
        licensekey_service_1.LicensekeyService])
], PlansOwnerController);
exports.PlansOwnerController = PlansOwnerController;
//# sourceMappingURL=plan-owner.controller.js.map