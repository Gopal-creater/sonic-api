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
exports.ChargebeePaymentController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const createChargebeePayment_dto_1 = require("../../chargebee/dto/createChargebeePayment.dto");
const chargebee_payment_service_1 = require("../services/chargebee-payment.service");
let ChargebeePaymentController = class ChargebeePaymentController {
    constructor(chargebeePaymentService) {
        this.chargebeePaymentService = chargebeePaymentService;
    }
    createChargeBeePayment(data) {
        return this.chargebeePaymentService.createPayment(data);
    }
    getChargeBeePayments() {
        return this.chargebeePaymentService.getPayments;
    }
};
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Creating a chargebee-payment after successful checkout.',
    }),
    (0, common_1.Post)('chargebee_payments'),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [createChargebeePayment_dto_1.CreateChargebeePaymentDto]),
    __metadata("design:returntype", void 0)
], ChargebeePaymentController.prototype, "createChargeBeePayment", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Get all chargebee-payment.',
    }),
    (0, common_1.Get)('chargebee_payments'),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ChargebeePaymentController.prototype, "getChargeBeePayments", null);
ChargebeePaymentController = __decorate([
    (0, swagger_1.ApiTags)('Chargebee payment controller'),
    (0, common_1.Controller)('chargebee_payment'),
    __metadata("design:paramtypes", [chargebee_payment_service_1.ChargebeePaymentService])
], ChargebeePaymentController);
exports.ChargebeePaymentController = ChargebeePaymentController;
//# sourceMappingURL=chargebee-payment.controller.js.map