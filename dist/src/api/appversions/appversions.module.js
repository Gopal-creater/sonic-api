"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppVersionModule = void 0;
const file_handler_service_1 = require("./../../shared/services/file-handler.service");
const mongoose_1 = require("@nestjs/mongoose");
const appversions_schema_1 = require("./schemas/appversions.schema");
const s3fileupload_module_1 = require("../s3fileupload/s3fileupload.module");
const appversions_service_1 = require("./appversions.service");
const appversions_controller_1 = require("./appversions.controller");
const common_1 = require("@nestjs/common");
const file_operation_service_1 = require("../../shared/services/file-operation.service");
const checkVersionCodeAndPlatform_middleware_1 = require("../../shared/middlewares/checkVersionCodeAndPlatform.middleware");
let AppVersionModule = class AppVersionModule {
    configure(consumer) {
        consumer
            .apply(checkVersionCodeAndPlatform_middleware_1.versionAndPlatform)
            .forRoutes({ path: 'app-versions', method: common_1.RequestMethod.GET });
    }
};
AppVersionModule = __decorate([
    common_1.Module({
        imports: [
            s3fileupload_module_1.S3FileUploadModule,
            mongoose_1.MongooseModule.forFeature([
                { name: appversions_schema_1.AppVersionSchemaName, schema: appversions_schema_1.AppVersionSchema },
            ]),
        ],
        controllers: [
            appversions_controller_1.AppVersionController
        ],
        providers: [appversions_service_1.AppVersionService, file_operation_service_1.FileOperationService, file_handler_service_1.FileHandlerService],
        exports: [appversions_service_1.AppVersionService],
    })
], AppVersionModule);
exports.AppVersionModule = AppVersionModule;
//# sourceMappingURL=appversions.module.js.map