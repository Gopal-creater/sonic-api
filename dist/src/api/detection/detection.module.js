"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DetectionModule = void 0;
const common_1 = require("@nestjs/common");
const detection_service_1 = require("./detection.service");
const detection_controller_1 = require("./controllers/detection.controller");
const detection_owner_controller_1 = require("./controllers/detection.owner.controller");
const mongoose_1 = require("@nestjs/mongoose");
const detection_schema_1 = require("./schemas/detection.schema");
const api_key_module_1 = require("../api-key/api-key.module");
const sonickey_module_1 = require("../sonickey/sonickey.module");
const user_module_1 = require("../user/user.module");
const detection_thirdparty_controller_1 = require("./controllers/detection.thirdparty.controller");
const auth_module_1 = require("../auth/auth.module");
let DetectionModule = class DetectionModule {
};
DetectionModule = __decorate([
    common_1.Module({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                {
                    name: detection_schema_1.Detection.name,
                    schema: detection_schema_1.DetectionSchema,
                },
            ]),
            common_1.forwardRef(() => api_key_module_1.ApiKeyModule),
            common_1.forwardRef(() => user_module_1.UserModule),
            common_1.forwardRef(() => auth_module_1.AuthModule),
            common_1.forwardRef(() => sonickey_module_1.SonickeyModule)
        ],
        controllers: [detection_controller_1.DetectionController, detection_owner_controller_1.DetectionOwnerController, detection_thirdparty_controller_1.DetectionThirdPartyController],
        providers: [detection_service_1.DetectionService],
        exports: [detection_service_1.DetectionService]
    })
], DetectionModule);
exports.DetectionModule = DetectionModule;
//# sourceMappingURL=detection.module.js.map