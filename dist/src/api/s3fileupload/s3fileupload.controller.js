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
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const user_decorator_1 = require("../auth/decorators/user.decorator");
const conditional_auth_guard_1 = require("../auth/guards/conditional-auth.guard");
const s3fileupload_dto_1 = require("./dtos/s3fileupload.dto");
let S3FileUploadController = class S3FileUploadController {
    constructor(s3FileUploadService) {
        this.s3FileUploadService = s3FileUploadService;
    }
    getSignedUrl(key, userId) {
        return this.s3FileUploadService.getSignedUrl(key);
    }
    getSignedUrlFromPost(key, userId) {
        if (!(key === null || key === void 0 ? void 0 : key.includes(userId))) {
            throw new common_1.ForbiddenException('You are not the owner of this file');
        }
        return this.s3FileUploadService.getSignedUrl(key);
    }
    async getFile(key, userId) {
        if (!(key === null || key === void 0 ? void 0 : key.includes(userId))) {
            throw new common_1.ForbiddenException('You are not the owner of this file');
        }
        const file = await this.s3FileUploadService.getFile(key);
        return new common_1.StreamableFile(Buffer.from(file.Body));
    }
    remove(key) {
        return this.s3FileUploadService.deleteFile(key);
    }
};
__decorate([
    common_1.Get('/signed-url/:key'),
    common_1.UseGuards(conditional_auth_guard_1.ConditionalAuthGuard),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiSecurity('x-api-key'),
    swagger_1.ApiOperation({ summary: 'Get Signed Url for download' }),
    openapi.ApiResponse({ status: 200, type: String }),
    __param(0, common_1.Param('key')),
    __param(1, user_decorator_1.User('sub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], S3FileUploadController.prototype, "getSignedUrl", null);
__decorate([
    common_1.Post('/get-signed-url'),
    common_1.UseGuards(conditional_auth_guard_1.ConditionalAuthGuard),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiBody({ type: s3fileupload_dto_1.DownloadS3FileDto }),
    swagger_1.ApiSecurity('x-api-key'),
    swagger_1.ApiOperation({ summary: 'Get Signed Url for download pass {key:string} in the body' }),
    openapi.ApiResponse({ status: 201, type: String }),
    __param(0, common_1.Body('key')),
    __param(1, user_decorator_1.User('sub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], S3FileUploadController.prototype, "getSignedUrlFromPost", null);
__decorate([
    common_1.Get(':key'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({ summary: 'Download file' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, common_1.Param('key')),
    __param(1, user_decorator_1.User('sub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], S3FileUploadController.prototype, "getFile", null);
__decorate([
    common_1.Delete(':key'),
    __param(0, common_1.Param('key')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], S3FileUploadController.prototype, "remove", null);
S3FileUploadController = __decorate([
    swagger_1.ApiTags('S3 File Upload Controller'),
    common_1.Controller('s3-file-uploads'),
    __metadata("design:paramtypes", [s3fileupload_service_1.S3FileUploadService])
], S3FileUploadController);
exports.S3FileUploadController = S3FileUploadController;
//# sourceMappingURL=s3fileupload.controller.js.map