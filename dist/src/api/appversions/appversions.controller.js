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
exports.AppVersionController = void 0;
const openapi = require("@nestjs/swagger");
const upload_app_version_dto_1 = require("./dto/upload-app-version.dto");
const version_dto_1 = require("./dto/version.dto");
const common_1 = require("@nestjs/common");
const appversions_service_1 = require("./appversions.service");
const platform_express_1 = require("@nestjs/platform-express");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const Enums_1 = require("../../constants/Enums");
const role_based_guard_1 = require("../auth/guards/role-based.guard");
const swagger_1 = require("@nestjs/swagger");
const guards_1 = require("../auth/guards");
const jsonparse_pipe_1 = require("../../shared/pipes/jsonparse.pipe");
const version_file_filter_1 = require("../../shared/filters/version-file-filter");
let AppVersionController = class AppVersionController {
    constructor(appVersionService) {
        this.appVersionService = appVersionService;
    }
    uploadVersion(versionDto, file, req) {
        var s3UploadResult;
        return this.appVersionService
            .uploadVersionToS3(file)
            .then(data => {
            s3UploadResult = data.s3UploadResult;
            const newVersion = {
                versionCode: versionDto.versionCode,
                releaseNote: versionDto.releaseNote,
                platform: versionDto.platform,
                contentVersionFilePath: s3UploadResult.Location,
                originalVersionFileName: file === null || file === void 0 ? void 0 : file.originalname,
                s3FileMeta: s3UploadResult
            };
            return this.appVersionService.saveVersion(newVersion);
        })
            .then(saveResult => {
            if (versionDto.latest) {
                return this.appVersionService.makeLatest(saveResult._id, saveResult.platform);
            }
            else {
                return saveResult;
            }
        })
            .catch(err => {
            throw new common_1.InternalServerErrorException(err);
        });
    }
    downloadVersionFileFromS3(key, res) {
        return this.appVersionService.getFile(key, res);
    }
    downloadFromVersionCode(versionCode, platform, res) {
        return this.appVersionService.downloadFromVersionCode(versionCode, platform, res);
    }
    downloadLatest(platform, res) {
        return this.appVersionService.downloadLatest(platform, res);
    }
    getVersionById(id) {
        return this.appVersionService.findOne(id);
    }
    getAllVersions() {
        return this.appVersionService.getAllVersions();
    }
    makeLatest(id) {
        return this.appVersionService.findOne(id)
            .then(responseObj => {
            if (!responseObj) {
                throw new common_1.NotFoundException("Record not found with the given ID.");
            }
            else {
                return this.appVersionService.makeLatest(id, responseObj.platform);
            }
        });
    }
    deleteFile(id) {
        return this.appVersionService.deleteRecordWithFile(id);
    }
};
__decorate([
    common_1.UseInterceptors(platform_express_1.FileInterceptor('mediaFile', {
        fileFilter: version_file_filter_1.versionFileFilter,
    })),
    swagger_1.ApiConsumes('multipart/form-data'),
    swagger_1.ApiBody({
        description: 'File To Upload',
        type: upload_app_version_dto_1.UploadAppVersionDto,
    }),
    roles_decorator_1.RolesAllowed(Enums_1.Roles.ADMIN),
    common_1.UseGuards(guards_1.JwtAuthGuard, role_based_guard_1.RoleBasedGuard),
    common_1.Post('/upload'),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({ summary: 'upload  version File And save to database' }),
    openapi.ApiResponse({ status: 201, type: require("./schemas/appversions.schema").AppVersion }),
    __param(0, common_1.Body('data', jsonparse_pipe_1.JsonParsePipe)),
    __param(1, common_1.UploadedFile()),
    __param(2, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [version_dto_1.Version, Object, Object]),
    __metadata("design:returntype", void 0)
], AppVersionController.prototype, "uploadVersion", null);
__decorate([
    common_1.Get('/download-file'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, common_1.Query('key')),
    __param(1, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AppVersionController.prototype, "downloadVersionFileFromS3", null);
__decorate([
    common_1.Get('/download-file-from-version-code'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, common_1.Query('versioncode')),
    __param(1, common_1.Query('platform')),
    __param(2, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], AppVersionController.prototype, "downloadFromVersionCode", null);
__decorate([
    common_1.Get('/download-file/latest/:platform'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, common_1.Param('platform')),
    __param(1, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AppVersionController.prototype, "downloadLatest", null);
__decorate([
    common_1.Get('/:id'),
    openapi.ApiResponse({ status: 200, type: require("./schemas/appversions.schema").AppVersion }),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AppVersionController.prototype, "getVersionById", null);
__decorate([
    common_1.Get(),
    roles_decorator_1.RolesAllowed(Enums_1.Roles.ADMIN),
    common_1.UseGuards(guards_1.JwtAuthGuard, role_based_guard_1.RoleBasedGuard),
    swagger_1.ApiBearerAuth(),
    openapi.ApiResponse({ status: 200, type: [require("./schemas/appversions.schema").AppVersion] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppVersionController.prototype, "getAllVersions", null);
__decorate([
    common_1.Post('/markLatest/:id'),
    roles_decorator_1.RolesAllowed(Enums_1.Roles.ADMIN),
    common_1.UseGuards(guards_1.JwtAuthGuard, role_based_guard_1.RoleBasedGuard),
    swagger_1.ApiBearerAuth(),
    openapi.ApiResponse({ status: 201, type: require("./schemas/appversions.schema").AppVersion }),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AppVersionController.prototype, "makeLatest", null);
__decorate([
    common_1.Delete('/:id'),
    roles_decorator_1.RolesAllowed(Enums_1.Roles.ADMIN),
    common_1.UseGuards(guards_1.JwtAuthGuard, role_based_guard_1.RoleBasedGuard),
    swagger_1.ApiBearerAuth(),
    openapi.ApiResponse({ status: 200 }),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AppVersionController.prototype, "deleteFile", null);
AppVersionController = __decorate([
    swagger_1.ApiTags('AppVersion Controller'),
    common_1.Controller('app-version'),
    __metadata("design:paramtypes", [appversions_service_1.AppVersionService])
], AppVersionController);
exports.AppVersionController = AppVersionController;
//# sourceMappingURL=appversions.controller.js.map