"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiKeyModule = void 0;
const common_1 = require("@nestjs/common");
const api_key_service_1 = require("./api-key.service");
const mongoose_1 = require("@nestjs/mongoose");
const api_key_controller_1 = require("./controllers/api-key.controller");
const api_key_customer_controller_1 = require("./controllers/api-key-customer.controller");
const api_key_schema_1 = require("./schemas/api-key.schema");
const user_module_1 = require("../user/user.module");
let ApiKeyModule = class ApiKeyModule {
};
ApiKeyModule = __decorate([
    common_1.Module({
        imports: [
            common_1.forwardRef(() => user_module_1.UserModule),
            mongoose_1.MongooseModule.forFeature([
                {
                    name: api_key_schema_1.ApiKeySchemaName,
                    schema: api_key_schema_1.ApiKeySchema,
                },
            ]),
        ],
        controllers: [api_key_controller_1.ApiKeyController, api_key_customer_controller_1.ApiKeyCustomerController],
        providers: [api_key_service_1.ApiKeyService],
        exports: [api_key_service_1.ApiKeyService]
    })
], ApiKeyModule);
exports.ApiKeyModule = ApiKeyModule;
//# sourceMappingURL=api-key.module.js.map