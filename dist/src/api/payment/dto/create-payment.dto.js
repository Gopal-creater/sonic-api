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
exports.BuyExtraKeysForExistingPlanDto = exports.UpgradePlanDto = exports.BuyPlanDto = exports.BrainTreeCustomerDto = exports.CreatePaymentDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreatePaymentDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { paymentMethodNonce: { required: true, type: () => String }, amount: { required: true, type: () => String }, deviceData: { required: false, type: () => String } };
    }
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreatePaymentDto.prototype, "paymentMethodNonce", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreatePaymentDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreatePaymentDto.prototype, "deviceData", void 0);
exports.CreatePaymentDto = CreatePaymentDto;
class BrainTreeCustomerDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: false, type: () => String }, firstName: { required: true, type: () => String }, lastName: { required: false, type: () => String }, company: { required: false, type: () => String }, email: { required: false, type: () => String }, phone: { required: false, type: () => String }, website: { required: false, type: () => String } };
    }
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], BrainTreeCustomerDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], BrainTreeCustomerDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], BrainTreeCustomerDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], BrainTreeCustomerDto.prototype, "company", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], BrainTreeCustomerDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], BrainTreeCustomerDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], BrainTreeCustomerDto.prototype, "website", void 0);
exports.BrainTreeCustomerDto = BrainTreeCustomerDto;
class BuyPlanDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { paymentMethodNonce: { required: true, type: () => String }, amount: { required: true, type: () => String }, deviceData: { required: false, type: () => String }, plan: { required: true, type: () => String } };
    }
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], BuyPlanDto.prototype, "paymentMethodNonce", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], BuyPlanDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], BuyPlanDto.prototype, "deviceData", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], BuyPlanDto.prototype, "plan", void 0);
exports.BuyPlanDto = BuyPlanDto;
class UpgradePlanDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { paymentMethodNonce: { required: true, type: () => String }, amount: { required: true, type: () => String }, deviceData: { required: false, type: () => String }, oldPlanLicenseKey: { required: true, type: () => String }, upgradedPlan: { required: true, type: () => String } };
    }
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpgradePlanDto.prototype, "paymentMethodNonce", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpgradePlanDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], UpgradePlanDto.prototype, "deviceData", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpgradePlanDto.prototype, "oldPlanLicenseKey", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpgradePlanDto.prototype, "upgradedPlan", void 0);
exports.UpgradePlanDto = UpgradePlanDto;
class BuyExtraKeysForExistingPlanDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { paymentMethodNonce: { required: true, type: () => String }, amount: { required: true, type: () => String }, deviceData: { required: false, type: () => String }, oldPlanLicenseKey: { required: true, type: () => String }, extraKeys: { required: true, type: () => Number } };
    }
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], BuyExtraKeysForExistingPlanDto.prototype, "paymentMethodNonce", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], BuyExtraKeysForExistingPlanDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], BuyExtraKeysForExistingPlanDto.prototype, "deviceData", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], BuyExtraKeysForExistingPlanDto.prototype, "oldPlanLicenseKey", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], BuyExtraKeysForExistingPlanDto.prototype, "extraKeys", void 0);
exports.BuyExtraKeysForExistingPlanDto = BuyExtraKeysForExistingPlanDto;
//# sourceMappingURL=create-payment.dto.js.map