"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LicensekeyModule = void 0;
const common_1 = require("@nestjs/common");
const licensekey_service_1 = require("./services/licensekey.service");
const licensekey_controller_1 = require("./controllers/licensekey.controller");
const mongoose_1 = require("@nestjs/mongoose");
const licensekey_schema_1 = require("./schemas/licensekey.schema");
const keygen_module_1 = require("../../shared/modules/keygen/keygen.module");
const user_module_1 = require("../user/user.module");
const licensekey_owner_controller_1 = require("./controllers/licensekey-owner.controller");
const company_module_1 = require("../company/company.module");
const plan_module_1 = require("../plan/plan.module");
let LicensekeyModule = class LicensekeyModule {
};
LicensekeyModule = __decorate([
    common_1.Module({
        imports: [
            common_1.forwardRef(() => user_module_1.UserModule),
            keygen_module_1.KeygenModule,
            company_module_1.CompanyModule,
            mongoose_1.MongooseModule.forFeature([
                {
                    name: licensekey_schema_1.LicenseKeySchemaName,
                    schema: licensekey_schema_1.LicenseKeySchema,
                },
            ]),
            common_1.forwardRef(() => plan_module_1.PlanModule),
        ],
        controllers: [licensekey_controller_1.LicensekeyController, licensekey_owner_controller_1.LicensekeyOwnerController],
        providers: [licensekey_service_1.LicensekeyService],
        exports: [licensekey_service_1.LicensekeyService],
    })
], LicensekeyModule);
exports.LicensekeyModule = LicensekeyModule;
//# sourceMappingURL=licensekey.module.js.map