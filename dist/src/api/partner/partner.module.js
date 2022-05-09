"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PartnerModule = void 0;
const common_1 = require("@nestjs/common");
const partner_service_1 = require("./services/partner.service");
const partner_controller_1 = require("./controllers/partner.controller");
const mongoose_1 = require("@nestjs/mongoose");
const user_module_1 = require("../user/user.module");
const partner_schema_1 = require("./schemas/partner.schema");
const partner_user_service_1 = require("./services/partner-user.service");
const partner_user_controller_1 = require("./controllers/partner-user.controller");
const company_module_1 = require("../company/company.module");
let PartnerModule = class PartnerModule {
};
PartnerModule = __decorate([
    common_1.Module({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: partner_schema_1.PartnerSchemaName, schema: partner_schema_1.PartnerSchema },
            ]),
            common_1.forwardRef(() => user_module_1.UserModule),
            common_1.forwardRef(() => company_module_1.CompanyModule),
        ],
        controllers: [partner_controller_1.PartnerController, partner_user_controller_1.PartnerUserController],
        providers: [partner_service_1.PartnerService, partner_user_service_1.PartnerUserService],
        exports: [partner_service_1.PartnerService, partner_user_service_1.PartnerUserService],
    })
], PartnerModule);
exports.PartnerModule = PartnerModule;
//# sourceMappingURL=partner.module.js.map