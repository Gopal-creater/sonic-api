"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModule = void 0;
const common_1 = require("@nestjs/common");
const user_controller_1 = require("./controllers/user.controller");
const user_service_1 = require("./services/user.service");
const licensekey_module_1 = require("../licensekey/licensekey.module");
const radiomonitor_module_1 = require("../radiomonitor/radiomonitor.module");
const mongoose_1 = require("@nestjs/mongoose");
const user_db_schema_1 = require("./schemas/user.db.schema");
const user_group_service_1 = require("./services/user-group.service");
const user_company_service_1 = require("./services/user-company.service");
const group_module_1 = require("../group/group.module");
const company_module_1 = require("../company/company.module");
const user_group_controller_1 = require("./controllers/user-group.controller");
const user_company_controller_1 = require("./controllers/user-company.controller");
const auth_module_1 = require("../auth/auth.module");
const api_key_module_1 = require("../api-key/api-key.module");
const userexists_validation_1 = require("./validations/userexists.validation");
const partner_module_1 = require("../partner/partner.module");
let UserModule = class UserModule {
};
UserModule = __decorate([
    (0, common_1.Module)({
        imports: [
            (0, common_1.forwardRef)(() => licensekey_module_1.LicensekeyModule),
            (0, common_1.forwardRef)(() => radiomonitor_module_1.RadiomonitorModule),
            mongoose_1.MongooseModule.forFeature([{ name: user_db_schema_1.UserSchemaName, schema: user_db_schema_1.UserSchema }]),
            group_module_1.GroupModule,
            (0, common_1.forwardRef)(() => api_key_module_1.ApiKeyModule),
            (0, common_1.forwardRef)(() => company_module_1.CompanyModule),
            (0, common_1.forwardRef)(() => partner_module_1.PartnerModule),
            (0, common_1.forwardRef)(() => auth_module_1.AuthModule),
        ],
        controllers: [user_controller_1.UserController, user_group_controller_1.UserGroupController, user_company_controller_1.UserCompanyController],
        providers: [user_group_service_1.UserGroupService, user_company_service_1.UserCompanyService, user_service_1.UserService, userexists_validation_1.UserExistsRule],
        exports: [user_group_service_1.UserGroupService, user_company_service_1.UserCompanyService, user_service_1.UserService],
    })
], UserModule);
exports.UserModule = UserModule;
//# sourceMappingURL=user.module.js.map