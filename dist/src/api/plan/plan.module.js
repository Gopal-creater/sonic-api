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
exports.PlanModule = void 0;
const common_1 = require("@nestjs/common");
const plan_service_1 = require("./plan.service");
const plan_controller_1 = require("./controllers/plan.controller");
const plan_owner_controller_1 = require("./controllers/plan-owner.controller");
const mongoose_1 = require("@nestjs/mongoose");
const plan_schema_1 = require("./schemas/plan.schema");
const licensekey_module_1 = require("../licensekey/licensekey.module");
const payment_module_1 = require("../payment/payment.module");
let PlanModule = class PlanModule {
    constructor(planService) {
        this.planService = planService;
    }
    onModuleInit() {
        this.planService.createDefaultPlans();
    }
};
PlanModule = __decorate([
    common_1.Module({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: plan_schema_1.PlanSchemaName, schema: plan_schema_1.PlanSchema }]),
            common_1.forwardRef(() => licensekey_module_1.LicensekeyModule),
            common_1.forwardRef(() => payment_module_1.PaymentModule),
        ],
        controllers: [plan_controller_1.PlanController, plan_owner_controller_1.PlansOwnerController],
        providers: [plan_service_1.PlanService],
        exports: [plan_service_1.PlanService],
    }),
    __metadata("design:paramtypes", [plan_service_1.PlanService])
], PlanModule);
exports.PlanModule = PlanModule;
//# sourceMappingURL=plan.module.js.map