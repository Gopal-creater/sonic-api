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
const payment_service_1 = require("./payment.service");
const create_payment_dto_1 = require("./dto/create-payment.dto");
const swagger_1 = require("@nestjs/swagger");
const plan_service_1 = require("../plan/plan.service");
let PaymentController = class PaymentController {
    constructor(paymentService, planService) {
        this.paymentService = paymentService;
        this.planService = planService;
    }
    findAll(customerId) {
        return this.paymentService.generateClientToken(customerId);
    }
    create(createPaymentDto) {
        return this.paymentService.create(createPaymentDto);
    }
    async createSubscription(createSubscriptionDto) {
        const { plan, paymentMethodNonce, amount, deviceData } = createSubscriptionDto;
        const planFromDb = await this.planService.findById(plan);
        if (!planFromDb) {
            throw new common_1.NotFoundException("Invalid plan selected, Plan not found");
        }
        return this.paymentService.create(createSubscriptionDto);
    }
};
__decorate([
    swagger_1.ApiQuery({ name: 'customerId', required: false }),
    common_1.Get('generate-client-token'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, common_1.Query('customerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PaymentController.prototype, "findAll", null);
__decorate([
    common_1.Post('/create-transaction'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_payment_dto_1.CreatePaymentDto]),
    __metadata("design:returntype", void 0)
], PaymentController.prototype, "create", null);
__decorate([
    common_1.Post('/create-subscription'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_payment_dto_1.CreateSubscriptionDto]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "createSubscription", null);
PaymentController = __decorate([
    swagger_1.ApiTags("Payment Gateway Controller"),
    common_1.Controller('payments'),
    __metadata("design:paramtypes", [payment_service_1.PaymentService, plan_service_1.PlanService])
], PaymentController);
exports.PaymentController = PaymentController;
//# sourceMappingURL=payment.controller.js.map