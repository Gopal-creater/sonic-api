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
exports.PaymentService = void 0;
const common_1 = require("@nestjs/common");
const braintree_1 = require("braintree");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const payment_schema_1 = require("../schemas/payment.schema");
let PaymentService = class PaymentService {
    constructor(paymentModel, configService) {
        this.paymentModel = paymentModel;
        this.configService = configService;
        this.brainTreeGateway = new braintree_1.BraintreeGateway({
            environment: braintree_1.Environment.Sandbox,
            merchantId: this.configService.get('MERCHANT_ID'),
            publicKey: this.configService.get('PUBLIC_KEY'),
            privateKey: this.configService.get('PRIVATE_KEY'),
        });
    }
    generateClientToken(customerId) {
        const requestObj = {};
        if (customerId) {
            requestObj['customerId'] = customerId;
        }
        return this.brainTreeGateway.clientToken.generate(requestObj);
    }
    create(createPaymentDto) {
        const { paymentMethodNonce, deviceData, amount } = createPaymentDto;
        return this.brainTreeGateway.transaction.sale({
            amount: amount,
            paymentMethodNonce: paymentMethodNonce,
            deviceData: deviceData,
            options: {
                submitForSettlement: true,
            },
        });
    }
    async createTransactionSaleInBrainTree(paymentMethodNonce, amount, deviceData) {
        return this.brainTreeGateway.transaction.sale({
            amount: amount,
            paymentMethodNonce: paymentMethodNonce,
            deviceData: deviceData,
            options: {
                submitForSettlement: true,
            },
        });
    }
    async getTransactionById(transactionId) {
        return this.brainTreeGateway.transaction
            .find(transactionId)
            .catch(err => Promise.resolve(null));
    }
    async createCustomerInBrainTree(customer, additionalData) {
        return this.brainTreeGateway.customer.create(Object.assign(Object.assign({}, customer), additionalData));
    }
    findAll(queryDto) {
        const { filter } = queryDto;
        return this.paymentModel.find(Object.assign({}, filter));
    }
    findOne(filter) {
        return this.paymentModel.findOne(filter);
    }
    findById(id) {
        return this.paymentModel.findById(id);
    }
    update(id, updatePaymentDto) {
        return this.paymentModel.findByIdAndUpdate(id, updatePaymentDto);
    }
    async getCount(queryDto) {
        const { filter } = queryDto;
        return this.paymentModel.find(filter || {}).count();
    }
    async getEstimateCount() {
        return this.paymentModel.estimatedDocumentCount();
    }
    async removeById(id) {
        const payment = await this.findById(id);
        return this.paymentModel.findByIdAndRemove(id);
    }
};
PaymentService = __decorate([
    common_1.Injectable(),
    __param(0, mongoose_1.InjectModel(payment_schema_1.Payment.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        config_1.ConfigService])
], PaymentService);
exports.PaymentService = PaymentService;
//# sourceMappingURL=payment.service.js.map