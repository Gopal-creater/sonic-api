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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3FileUploadController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const s3fileupload_service_1 = require("./s3fileupload.service");
const swagger_1 = require("@nestjs/swagger");
let S3FileUploadController = class S3FileUploadController {
    constructor(s3FileUploadService) {
        this.s3FileUploadService = s3FileUploadService;
    }
    getSignedUrl(key) {
        return this.s3FileUploadService.getSignedUrl(key);
    }
    async getFile(key) {
        const file = await this.s3FileUploadService.getFile(key);
        console.log("file", file);
        return "done";
    }
};
__decorate([
    common_1.Get('/signed-url/:key'),
    openapi.ApiResponse({ status: 200, type: String }),
    __param(0, common_1.Param('key')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], S3FileUploadController.prototype, "getSignedUrl", null);
__decorate([
    common_1.Get(':key'),
    openapi.ApiResponse({ status: 200, type: String }),
    __param(0, common_1.Param('key')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], S3FileUploadController.prototype, "getFile", null);
S3FileUploadController = __decorate([
    swagger_1.ApiTags('S3 File Upload Controller'),
    common_1.Controller('s3-file-uploads'),
    __metadata("design:paramtypes", [s3fileupload_service_1.S3FileUploadService])
], S3FileUploadController);
exports.S3FileUploadController = S3FileUploadController;
//# sourceMappingURL=s3fileupload.controller.js.map