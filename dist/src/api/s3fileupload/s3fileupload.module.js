"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3FileUploadModule = void 0;
const common_1 = require("@nestjs/common");
const s3fileupload_service_1 = require("./s3fileupload.service");
const s3fileupload_controller_1 = require("./s3fileupload.controller");
const auth_module_1 = require("../auth/auth.module");
let S3FileUploadModule = class S3FileUploadModule {
};
S3FileUploadModule = __decorate([
    (0, common_1.Module)({
        imports: [(0, common_1.forwardRef)(() => auth_module_1.AuthModule)],
        controllers: [s3fileupload_controller_1.S3FileUploadController],
        providers: [s3fileupload_service_1.S3FileUploadService],
        exports: [s3fileupload_service_1.S3FileUploadService],
    })
], S3FileUploadModule);
exports.S3FileUploadModule = S3FileUploadModule;
//# sourceMappingURL=s3fileupload.module.js.map