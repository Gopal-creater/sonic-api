"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrackModule = void 0;
const common_1 = require("@nestjs/common");
const track_service_1 = require("./track.service");
const track_controller_1 = require("./controllers/track.controller");
const mongoose_1 = require("@nestjs/mongoose");
const track_schema_1 = require("./schemas/track.schema");
const user_module_1 = require("../user/user.module");
const s3fileupload_module_1 = require("../s3fileupload/s3fileupload.module");
const file_handler_service_1 = require("../../shared/services/file-handler.service");
let TrackModule = class TrackModule {
};
TrackModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: track_schema_1.TrackSchemaName, schema: track_schema_1.TrackSchema }]),
            (0, common_1.forwardRef)(() => user_module_1.UserModule),
            s3fileupload_module_1.S3FileUploadModule,
        ],
        controllers: [track_controller_1.TrackController],
        providers: [track_service_1.TrackService, file_handler_service_1.FileHandlerService],
        exports: [track_service_1.TrackService],
    })
], TrackModule);
exports.TrackModule = TrackModule;
//# sourceMappingURL=track.module.js.map