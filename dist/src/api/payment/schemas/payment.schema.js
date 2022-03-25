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
exports.PaymentSchema = exports.Payment = exports.PaymentSchemaName = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const swagger_1 = require("@nestjs/swagger");
exports.PaymentSchemaName = 'Payment';
let Payment = class Payment extends mongoose_2.Document {
};
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop({
        required: true,
    }),
    __metadata("design:type", String)
], Payment.prototype, "amount", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop(),
    __metadata("design:type", String)
], Payment.prototype, "paymentMethodNonce", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop(),
    __metadata("design:type", String)
], Payment.prototype, "deviceData", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop(),
    __metadata("design:type", String)
], Payment.prototype, "braintreeTransactionId", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop({ type: mongoose_2.Schema.Types.ObjectId }),
    __metadata("design:type", Object)
], Payment.prototype, "braintreeTransactionResult", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop(),
    __metadata("design:type", String)
], Payment.prototype, "braintreeTransactionStatus", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop({
        type: String,
        ref: 'User',
        required: true,
        autopopulate: { maxDepth: 2 },
    }),
    __metadata("design:type", Object)
], Payment.prototype, "user", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop({
        type: mongoose_2.Schema.Types.ObjectId,
        ref: 'Plan',
        autopopulate: { maxDepth: 2 },
    }),
    __metadata("design:type", Object)
], Payment.prototype, "plan", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop({
        type: String,
        ref: 'LicenseKey',
        autopopulate: { maxDepth: 2 },
    }),
    __metadata("design:type", Object)
], Payment.prototype, "licenseKey", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop(),
    __metadata("design:type", String)
], Payment.prototype, "notes", void 0);
Payment = __decorate([
    mongoose_1.Schema({ timestamps: true, collection: exports.PaymentSchemaName })
], Payment);
exports.Payment = Payment;
exports.PaymentSchema = mongoose_1.SchemaFactory.createForClass(Payment);
//# sourceMappingURL=payment.schema.js.map