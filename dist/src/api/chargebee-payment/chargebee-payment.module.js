"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChargebeePaymentModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const chargebee_payment_controller_1 = require("./controllers/chargebee-payment.controller");
const chargebee_payment_schema_1 = require("./schemas/chargebee-payment.schema");
const chargebee_payment_service_1 = require("./services/chargebee-payment.service");
let ChargebeePaymentModule = class ChargebeePaymentModule {
};
ChargebeePaymentModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: 'ChargeBeePayment', schema: chargebee_payment_schema_1.ChargeBeePaymentSchema },
            ]),
        ],
        controllers: [chargebee_payment_controller_1.ChargebeePaymentController],
        providers: [chargebee_payment_service_1.ChargebeePaymentService],
    })
], ChargebeePaymentModule);
exports.ChargebeePaymentModule = ChargebeePaymentModule;
//# sourceMappingURL=chargebee-payment.module.js.map