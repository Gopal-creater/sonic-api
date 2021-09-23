"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SonickeyModule = void 0;
const file_handler_service_1 = require("./../../shared/services/file-handler.service");
const common_1 = require("@nestjs/common");
const sonickey_controller_1 = require("./controllers/sonickey.controller");
const sonickey_service_1 = require("./services/sonickey.service");
const mongoose_1 = require("@nestjs/mongoose");
const sonickey_schema_1 = require("./schemas/sonickey.schema");
const file_operation_service_1 = require("../../shared/services/file-operation.service");
const sonickey_guest_controller_1 = require("./controllers/sonickey.guest.controller");
const sonickey_binary_controller_1 = require("./controllers/sonickey.binary.controller");
const api_key_module_1 = require("../api-key/api-key.module");
const licensekey_module_1 = require("../licensekey/licensekey.module");
const s3fileupload_module_1 = require("../s3fileupload/s3fileupload.module");
const detection_module_1 = require("../detection/detection.module");
const sonickey_thirdparty_controller_1 = require("./controllers/sonickey.thirdparty.controller");
const user_module_1 = require("../user/user.module");
let SonickeyModule = class SonickeyModule {
};
SonickeyModule = __decorate([
    common_1.Module({
        imports: [
            api_key_module_1.ApiKeyModule,
            licensekey_module_1.LicensekeyModule,
            user_module_1.UserModule,
            common_1.forwardRef(() => detection_module_1.DetectionModule),
            s3fileupload_module_1.S3FileUploadModule,
            mongoose_1.MongooseModule.forFeature([
                { name: sonickey_schema_1.SonicKeySchemaName, schema: sonickey_schema_1.SonicKeySchema },
            ]),
        ],
        controllers: [
            sonickey_controller_1.SonickeyController,
            sonickey_guest_controller_1.SonickeyGuestController,
            sonickey_binary_controller_1.SonickeyBinaryController,
            sonickey_thirdparty_controller_1.SonickeyThirdPartyController
        ],
        providers: [sonickey_service_1.SonickeyService, file_operation_service_1.FileOperationService, file_handler_service_1.FileHandlerService],
        exports: [sonickey_service_1.SonickeyService],
    })
], SonickeyModule);
exports.SonickeyModule = SonickeyModule;
//# sourceMappingURL=sonickey.module.js.map