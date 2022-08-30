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
exports.BuyExtraKeysForExistingPlanDto = exports.RenewPlanDto = exports.UpgradePlanDto = exports.BuyPlanDto = exports.CreatePlanDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const Enums_1 = require("../../../constants/Enums");
class CreatePlanDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: true, enum: require("../../../constants/Enums").PlanName }, type: { required: true, enum: require("../../../constants/Enums").PlanType }, description: { required: true, type: () => String }, availableSonicKeys: { required: true, type: () => Number }, limitedSonicKeys: { required: true, type: () => Number }, cost: { required: true, type: () => Number }, perExtraCost: { required: true, type: () => Number }, paymentInterval: { required: true, type: () => String }, notes: { required: true, type: () => String } };
    }
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(Enums_1.PlanName),
    (0, swagger_1.ApiProperty)({
        enum: Enums_1.PlanName,
    }),
    __metadata("design:type", String)
], CreatePlanDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(Enums_1.PlanType),
    (0, swagger_1.ApiProperty)({
        enum: Enums_1.PlanType,
    }),
    __metadata("design:type", String)
], CreatePlanDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreatePlanDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreatePlanDto.prototype, "availableSonicKeys", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreatePlanDto.prototype, "limitedSonicKeys", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreatePlanDto.prototype, "cost", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreatePlanDto.prototype, "perExtraCost", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreatePlanDto.prototype, "paymentInterval", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreatePlanDto.prototype, "notes", void 0);
exports.CreatePlanDto = CreatePlanDto;
class BuyPlanDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { paymentMethodNonce: { required: true, type: () => String }, transactionId: { required: true, type: () => String }, amount: { required: true, type: () => String }, deviceData: { required: false, type: () => String }, plan: { required: true, type: () => String } };
    }
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], BuyPlanDto.prototype, "paymentMethodNonce", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], BuyPlanDto.prototype, "transactionId", void 0);
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
        return { paymentMethodNonce: { required: true, type: () => String }, transactionId: { required: true, type: () => String }, amount: { required: true, type: () => String }, deviceData: { required: false, type: () => String }, oldPlanLicenseKey: { required: true, type: () => String }, upgradedPlan: { required: true, type: () => String } };
    }
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], UpgradePlanDto.prototype, "paymentMethodNonce", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], UpgradePlanDto.prototype, "transactionId", void 0);
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
class RenewPlanDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { paymentMethodNonce: { required: true, type: () => String }, transactionId: { required: true, type: () => String }, amount: { required: true, type: () => String }, deviceData: { required: false, type: () => String }, oldPlanLicenseKey: { required: true, type: () => String } };
    }
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], RenewPlanDto.prototype, "paymentMethodNonce", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], RenewPlanDto.prototype, "transactionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], RenewPlanDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], RenewPlanDto.prototype, "deviceData", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], RenewPlanDto.prototype, "oldPlanLicenseKey", void 0);
exports.RenewPlanDto = RenewPlanDto;
class BuyExtraKeysForExistingPlanDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { paymentMethodNonce: { required: true, type: () => String }, transactionId: { required: true, type: () => String }, amount: { required: true, type: () => String }, deviceData: { required: false, type: () => String }, oldPlanLicenseKey: { required: true, type: () => String }, extraKeys: { required: true, type: () => Number } };
    }
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], BuyExtraKeysForExistingPlanDto.prototype, "paymentMethodNonce", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], BuyExtraKeysForExistingPlanDto.prototype, "transactionId", void 0);
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
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], BuyExtraKeysForExistingPlanDto.prototype, "extraKeys", void 0);
exports.BuyExtraKeysForExistingPlanDto = BuyExtraKeysForExistingPlanDto;
//# sourceMappingURL=create-plan.dto.js.map