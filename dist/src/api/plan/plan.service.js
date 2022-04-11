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
exports.PlanService = void 0;
const common_1 = require("@nestjs/common");
const plan_schema_1 = require("./schemas/plan.schema");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const Enums_1 = require("../../constants/Enums");
const payment_service_1 = require("../payment/services/payment.service");
const licensekey_service_1 = require("../licensekey/services/licensekey.service");
let PlanService = class PlanService {
    constructor(planModel, paymentService, licenseKeyService) {
        this.planModel = planModel;
        this.paymentService = paymentService;
        this.licenseKeyService = licenseKeyService;
    }
    async create(createPlanDto) {
        const newPlan = await this.planModel.create(createPlanDto);
        return newPlan.save();
    }
    findAll(queryDto) {
        const { filter } = queryDto;
        return this.planModel.find(Object.assign({}, filter));
    }
    findOne(filter) {
        return this.planModel.findOne(filter);
    }
    findById(id) {
        return this.planModel.findById(id);
    }
    update(id, updatePlanDto) {
        return this.planModel.findByIdAndUpdate(id, updatePlanDto);
    }
    async getCount(queryDto) {
        const { filter } = queryDto;
        return this.planModel.find(filter || {}).count();
    }
    async getEstimateCount() {
        return this.planModel.estimatedDocumentCount();
    }
    async removeById(id) {
        const plan = await this.findById(id);
        return this.planModel.findByIdAndRemove(id);
    }
    async createDefaultPlans() {
        await this.planModel.findOneAndUpdate({
            name: Enums_1.PlanName.BASIC,
            type: Enums_1.PlanType.ENCODE,
        }, {
            name: Enums_1.PlanName.BASIC,
            type: Enums_1.PlanType.ENCODE,
            description: 'encode a songs',
            availableSonicKeys: 10,
            limitedSonicKeys: 100,
            cost: 9.99,
            perExtraCost: 0.99,
            paymentInterval: Enums_1.PaymentInterval.ANNUAL,
            featureLists: [
                "10 SonicKeys available",
                "£0.99 per extra SonicKey",
                "Limited to 100 SonicKeys total"
            ]
        }, { upsert: true });
        await this.planModel.findOneAndUpdate({
            name: Enums_1.PlanName.STANDARD,
            type: Enums_1.PlanType.ENCODE,
        }, {
            name: Enums_1.PlanName.STANDARD,
            type: Enums_1.PlanType.ENCODE,
            description: 'encode a songs',
            availableSonicKeys: 50,
            limitedSonicKeys: 100,
            cost: 39.99,
            perExtraCost: 0.99,
            paymentInterval: Enums_1.PaymentInterval.ANNUAL,
            featureLists: [
                "50 SonicKeys available",
                "£0.99 per extra SonicKey",
                "Limited to 100 SonicKeys total"
            ]
        }, { upsert: true });
        await this.planModel.findOneAndUpdate({
            name: Enums_1.PlanName.PREMIUM,
            type: Enums_1.PlanType.ENCODE,
        }, {
            name: Enums_1.PlanName.PREMIUM,
            type: Enums_1.PlanType.ENCODE,
            description: 'encode a songs, for extra keys contact admin',
            availableSonicKeys: 100,
            limitedSonicKeys: null,
            cost: 69.99,
            perExtraCost: 0.99,
            paymentInterval: Enums_1.PaymentInterval.ANNUAL,
            featureLists: [
                "100 SonicKeys available",
                "£0.99 per extra SonicKey"
            ]
        }, { upsert: true });
        return {
            message: 'Created default plans',
            success: true,
        };
    }
    async buyPlan(user, buyPlanDto) {
        var _a;
        const { amount, paymentMethodNonce, transactionId, deviceData, plan, } = buyPlanDto;
        var brainTreeTransactionResponse;
        if (!transactionId && paymentMethodNonce) {
            const createdSale = await this.paymentService.createTransactionSaleInBrainTree(paymentMethodNonce, amount, deviceData).catch(err => {
                throw new common_1.BadRequestException(err);
            });
            if (!createdSale.success) {
                throw new common_1.BadRequestException(`Transaction Failed : ${(_a = createdSale === null || createdSale === void 0 ? void 0 : createdSale.transaction) === null || _a === void 0 ? void 0 : _a.status}`);
            }
            brainTreeTransactionResponse = createdSale.transaction;
        }
        else if (transactionId) {
            brainTreeTransactionResponse = await this.paymentService.getTransactionById(transactionId);
        }
        if (!brainTreeTransactionResponse) {
            throw new common_1.NotFoundException("Invalid transaction");
        }
        const newPaymentInDb = await this.paymentService.paymentModel.create({
            amount: amount,
            paymentMethodNonce: paymentMethodNonce,
            deviceData: deviceData,
            braintreeTransactionId: brainTreeTransactionResponse.id,
            braintreeTransactionStatus: brainTreeTransactionResponse.status,
            braintreeTransactionResult: brainTreeTransactionResponse,
            user: user,
            plan: plan,
            notes: `Done payment for plan id ${plan} at amount ${amount}`,
        });
        const payment = await newPaymentInDb.save();
        const licenseFromPlan = await this.licenseKeyService.createLicenseFromPlanAndAssignToUser(user, plan, payment._id);
        payment.licenseKey = licenseFromPlan.key;
        await payment.save();
        return {
            payment: payment,
            brainTreeTransactionResponse: brainTreeTransactionResponse,
            licenseFromPlan: licenseFromPlan,
        };
    }
    async fetchMyPlans(user, queryDto) {
        queryDto.filter = Object.assign(Object.assign({}, queryDto.filter), { users: user, type: Enums_1.ApiKeyType.INDIVIDUAL, activePlan: { $exists: true } });
        return this.licenseKeyService.findAll(queryDto);
    }
    async upgradePlan(user, upgradePlanDto) {
        var _a;
        const { amount, paymentMethodNonce, transactionId, deviceData, oldPlanLicenseKey, upgradedPlan, } = upgradePlanDto;
        var brainTreeTransactionResponse;
        if (!transactionId && paymentMethodNonce) {
            const createdSale = await this.paymentService.createTransactionSaleInBrainTree(paymentMethodNonce, amount, deviceData)
                .catch(err => {
                throw new common_1.BadRequestException(err);
            });
            if (!createdSale.success) {
                throw new common_1.BadRequestException(`Transaction Failed : ${(_a = createdSale === null || createdSale === void 0 ? void 0 : createdSale.transaction) === null || _a === void 0 ? void 0 : _a.status}`);
            }
            brainTreeTransactionResponse = createdSale.transaction;
        }
        else if (transactionId) {
            brainTreeTransactionResponse = await this.paymentService.getTransactionById(transactionId);
        }
        if (!brainTreeTransactionResponse) {
            throw new common_1.NotFoundException("Invalid transaction");
        }
        const newPaymentInDb = await this.paymentService.paymentModel.create({
            amount: amount,
            paymentMethodNonce: paymentMethodNonce,
            deviceData: deviceData,
            braintreeTransactionId: brainTreeTransactionResponse.id,
            braintreeTransactionStatus: brainTreeTransactionResponse.status,
            braintreeTransactionResult: brainTreeTransactionResponse,
            user: user,
            plan: upgradedPlan,
            notes: `Done upgrade payment for plan id ${upgradedPlan} at amount ${amount}`,
        });
        const payment = await newPaymentInDb.save();
        const licenseFromPlan = await this.licenseKeyService.upgradeLicenseFromPlanAndAssignToUser(oldPlanLicenseKey, user, upgradedPlan, payment._id);
        payment.licenseKey = licenseFromPlan.key;
        await payment.save();
        return {
            payment: payment,
            brainTreeTransactionResponse: brainTreeTransactionResponse,
            licenseFromPlan: licenseFromPlan,
        };
    }
    async buyExtraKeysForPlan(user, buyExtraKeysForExistingPlanDto) {
        var _a, _b;
        const { amount, paymentMethodNonce, transactionId, deviceData, oldPlanLicenseKey, extraKeys, } = buyExtraKeysForExistingPlanDto;
        var brainTreeTransactionResponse;
        if (!transactionId && paymentMethodNonce) {
            const createdSale = await this.paymentService.createTransactionSaleInBrainTree(paymentMethodNonce, amount, deviceData)
                .catch(err => {
                throw new common_1.BadRequestException(err);
            });
            if (!createdSale.success) {
                throw new common_1.BadRequestException(`Transaction Failed : ${(_a = createdSale === null || createdSale === void 0 ? void 0 : createdSale.transaction) === null || _a === void 0 ? void 0 : _a.status}`);
            }
            brainTreeTransactionResponse = createdSale.transaction;
        }
        else if (transactionId) {
            brainTreeTransactionResponse = await this.paymentService.getTransactionById(transactionId);
        }
        if (!brainTreeTransactionResponse) {
            throw new common_1.NotFoundException("Invalid transaction");
        }
        const oldPlanLicenseKeyFromDb = await this.licenseKeyService.findOne({
            key: oldPlanLicenseKey,
        });
        const newPaymentInDb = await this.paymentService.paymentModel.create({
            amount: amount,
            paymentMethodNonce: paymentMethodNonce,
            deviceData: deviceData,
            braintreeTransactionId: brainTreeTransactionResponse.id,
            braintreeTransactionStatus: brainTreeTransactionResponse.status,
            braintreeTransactionResult: brainTreeTransactionResponse,
            user: user,
            plan: (_b = oldPlanLicenseKeyFromDb === null || oldPlanLicenseKeyFromDb === void 0 ? void 0 : oldPlanLicenseKeyFromDb.activePlan) === null || _b === void 0 ? void 0 : _b._id,
            licenseKey: oldPlanLicenseKey,
            notes: `Brought ${extraKeys} extraKeys for existing plan and existing license key ${oldPlanLicenseKey}`,
        });
        const payment = await newPaymentInDb.save();
        const licenseFromPlan = await this.licenseKeyService.addExtraUsesToLicenseFromPlanAndAssignToUser(oldPlanLicenseKey, user, extraKeys, payment._id);
        return {
            payment: payment,
            brainTreeTransactionResponse: brainTreeTransactionResponse,
            licenseFromPlan: licenseFromPlan,
        };
    }
};
PlanService = __decorate([
    common_1.Injectable(),
    __param(0, mongoose_1.InjectModel(plan_schema_1.Plan.name)),
    __param(1, common_1.Inject(common_1.forwardRef(() => payment_service_1.PaymentService))),
    __param(2, common_1.Inject(common_1.forwardRef(() => licensekey_service_1.LicensekeyService))),
    __metadata("design:paramtypes", [mongoose_2.Model,
        payment_service_1.PaymentService,
        licensekey_service_1.LicensekeyService])
], PlanService);
exports.PlanService = PlanService;
//# sourceMappingURL=plan.service.js.map