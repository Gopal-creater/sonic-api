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
exports.PaymentService = void 0;
const common_1 = require("@nestjs/common");
const braintree_1 = require("braintree");
const config_1 = require("@nestjs/config");
let PaymentService = class PaymentService {
    constructor(configService) {
        this.configService = configService;
        this.brainTreeGateway = new braintree_1.BraintreeGateway({
            environment: braintree_1.Environment.Sandbox,
            merchantId: this.configService.get('MERCHANT_ID'),
            publicKey: this.configService.get('PUBLIC_KEY'),
            privateKey: this.configService.get('PRIVATE_KEY')
        });
    }
    generateClientToken(customerId) {
        const requestObj = {};
        if (customerId) {
            requestObj["customerId"] = customerId;
        }
        return this.brainTreeGateway.clientToken.generate(requestObj);
    }
    create(createPaymentDto) {
        return 'This action adds a new payment';
    }
    findAll() {
        return `This action returns all payment`;
    }
    findOne(id) {
        return `This action returns a #${id} payment`;
    }
    update(id, updatePaymentDto) {
        return `This action updates a #${id} payment`;
    }
    remove(id) {
        return `This action removes a #${id} payment`;
    }
};
PaymentService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], PaymentService);
exports.PaymentService = PaymentService;
//# sourceMappingURL=payment.service.js.map