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
exports.RadiostationController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const radiostation_service_1 = require("../services/radiostation.service");
const create_radiostation_dto_1 = require("../dto/create-radiostation.dto");
const update_radiostation_dto_1 = require("../dto/update-radiostation.dto");
const swagger_1 = require("@nestjs/swagger");
const multer_1 = require("multer");
const makeDir = require("make-dir");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const bulk_radiostation_dto_1 = require("../dto/bulk-radiostation.dto");
const parseQueryValue_pipe_1 = require("../../../shared/pipes/parseQueryValue.pipe");
const parsedquery_dto_1 = require("../../../shared/dtos/parsedquery.dto");
const anyapiquerytemplate_decorator_1 = require("../../../shared/decorators/anyapiquerytemplate.decorator");
const user_decorator_1 = require("../../auth/decorators/user.decorator");
const fs = require("fs");
const upath = require("upath");
const platform_express_1 = require("@nestjs/platform-express");
const app_config_1 = require("../../../config/app.config");
const decorators_1 = require("../../auth/decorators");
const Enums_1 = require("../../../constants/Enums");
const guards_1 = require("../../auth/guards");
const conditional_auth_guard_1 = require("../../auth/guards/conditional-auth.guard");
const appGenMulterOption_1 = require("../config/appGenMulterOption");
let RadiostationController = class RadiostationController {
    constructor(radiostationService) {
        this.radiostationService = radiostationService;
    }
    async export(res, format, queryDto) {
        var filePath = '';
        switch (format) {
            case 'JSON':
                filePath = await this.radiostationService.exportToJson(queryDto);
                break;
            case 'EXCEL':
                filePath = await this.radiostationService.exportToExcel(queryDto);
                break;
            default:
                filePath = await this.radiostationService.exportToExcel(queryDto);
                break;
        }
        res.download(filePath, err => {
            if (err) {
                fs.unlinkSync(filePath);
                res.send(err);
            }
            fs.unlinkSync(filePath);
        });
    }
    async importFromExcel(file) {
        const excelPath = upath.toUnix(file.path);
        return this.radiostationService.importFromExcel(excelPath).finally(() => {
            fs.unlinkSync(excelPath);
        });
    }
    async uploadExcel(file) {
        const excelPath = upath.toUnix(file.path);
        console.log("file", file);
        console.log("Excel Path", excelPath);
        return this.radiostationService.importFromAppgenExcel(excelPath).catch((err) => {
            throw err;
        }).finally(() => {
            fs.unlinkSync(excelPath);
        });
    }
    async getCount(queryDto) {
        return this.radiostationService.getCount(queryDto);
    }
    async getEstimateCount() {
        return this.radiostationService.getEstimateCount();
    }
    async create(createdBy, createRadiostationDto) {
        const isPresent = await this.radiostationService.radioStationModel.findOne({
            streamingUrl: createRadiostationDto.streamingUrl,
        });
        if (isPresent) {
            throw new common_1.BadRequestException('Duplicate stramingURL');
        }
        return this.radiostationService.create(createRadiostationDto, {
            createdBy: createdBy,
        });
    }
    findAll(queryDto) {
        return this.radiostationService.findAll(queryDto);
    }
    async findOne(id) {
        const radioStation = await this.radiostationService.radioStationModel.findById(id);
        if (!radioStation) {
            throw new common_1.NotFoundException();
        }
        return radioStation;
    }
    stopListeningStream(id) {
        return this.radiostationService.stopListeningStream(id).catch(err => {
            if (err.status == 404) {
                throw new common_1.NotFoundException();
            }
            throw err;
        });
    }
    startListeningStream(id) {
        return this.radiostationService.startListeningStream(id).catch(err => {
            if (err.status == 404) {
                throw new common_1.NotFoundException();
            }
            throw err;
        });
    }
    bulkStartListeningStream(bulkDto) {
        return this.radiostationService.bulkStartListeningStream(bulkDto.ids);
    }
    bulkStopListeningStream(bulkDto) {
        return this.radiostationService.bulkStopListeningStream(bulkDto.ids);
    }
    async update(id, updatedBy, updateRadiostationDto) {
        const updatedRadioStation = await this.radiostationService.radioStationModel.findOneAndUpdate({ _id: id }, Object.assign(Object.assign({}, updateRadiostationDto), { updatedBy: updatedBy }), { new: true });
        if (!updatedRadioStation) {
            throw new common_1.NotFoundException();
        }
        return updatedRadioStation;
    }
    removeBulk(bulkDto) {
        return this.radiostationService.bulkRemove(bulkDto.ids);
    }
    remove(id) {
        return this.radiostationService.removeById(id).catch(err => {
            if (err.status == 404) {
                throw new common_1.NotFoundException();
            }
            throw err;
        });
    }
};
__decorate([
    (0, decorators_1.RolesAllowed)(Enums_1.Roles.ADMIN),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, guards_1.RoleBasedGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiParam)({ name: 'format', enum: ['JSON', 'EXCEL'] }),
    (0, anyapiquerytemplate_decorator_1.AnyApiQueryTemplate)(),
    (0, swagger_1.ApiOperation)({ summary: 'Export Radio Stations' }),
    (0, common_1.Get)('/export/:format'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Param)('format')),
    __param(2, (0, common_1.Query)(new parseQueryValue_pipe_1.ParseQueryValue())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, parsedquery_dto_1.ParsedQueryDto]),
    __metadata("design:returntype", Promise)
], RadiostationController.prototype, "export", null);
__decorate([
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('importFile', {
        fileFilter: (req, file, cb) => {
            var _a, _b;
            if ((_b = (_a = file === null || file === void 0 ? void 0 : file.originalname) === null || _a === void 0 ? void 0 : _a.match) === null || _b === void 0 ? void 0 : _b.call(_a, /\.(xlsx|xlsb|xls|xlsm)$/)) {
                cb(null, true);
            }
            else {
                cb(new common_1.BadRequestException('Unsupported file type, only support excel for now'), false);
            }
        },
        storage: (0, multer_1.diskStorage)({
            destination: async (req, file, cb) => {
                const filePath = await makeDir(`${app_config_1.appConfig.MULTER_IMPORT_DEST}`);
                cb(null, filePath);
            },
            filename: (req, file, cb) => {
                let orgName = file.originalname.replace(/[^a-zA-Z0-9.]/g, '_');
                cb(null, `${Date.now()}_${orgName}`);
            },
        }),
    })),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiOperation)({ summary: 'Import Radio Stations From Excel' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                importFile: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    }),
    (0, decorators_1.RolesAllowed)(Enums_1.Roles.ADMIN),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, guards_1.RoleBasedGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)('/import-from-excel'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RadiostationController.prototype, "importFromExcel", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Import list of radio stations from appgen excel file' }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('importFile', appGenMulterOption_1.appGenMulterOptions)),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({ schema: { type: 'object', properties: { importFile: { type: 'string', format: 'binary' } } } }),
    (0, decorators_1.RolesAllowed)(Enums_1.Roles.ADMIN),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, guards_1.RoleBasedGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)("/import-from-appgen-excel"),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RadiostationController.prototype, "uploadExcel", null);
__decorate([
    (0, common_1.Get)('/count'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, anyapiquerytemplate_decorator_1.AnyApiQueryTemplate)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get count of all radiostations also accept filter as query params',
    }),
    openapi.ApiResponse({ status: 200, type: Number }),
    __param(0, (0, common_1.Query)(new parseQueryValue_pipe_1.ParseQueryValue())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [parsedquery_dto_1.ParsedQueryDto]),
    __metadata("design:returntype", Promise)
], RadiostationController.prototype, "getCount", null);
__decorate([
    (0, common_1.Get)('/estimate-count'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all count of all radiostations',
    }),
    openapi.ApiResponse({ status: 200, type: Number }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RadiostationController.prototype, "getEstimateCount", null);
__decorate([
    (0, common_1.Post)(),
    (0, decorators_1.RolesAllowed)(Enums_1.Roles.ADMIN),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, guards_1.RoleBasedGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create Radio Station' }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, user_decorator_1.User)('sub')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_radiostation_dto_1.CreateRadiostationDto]),
    __metadata("design:returntype", Promise)
], RadiostationController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(conditional_auth_guard_1.ConditionalAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiSecurity)('x-api-key'),
    (0, anyapiquerytemplate_decorator_1.AnyApiQueryTemplate)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get All Radio Stations' }),
    openapi.ApiResponse({ status: 200, type: require("../dto/mongoosepaginate-radiostation.dto").MongoosePaginateRadioStationDto }),
    __param(0, (0, common_1.Query)(new parseQueryValue_pipe_1.ParseQueryValue())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [parsedquery_dto_1.ParsedQueryDto]),
    __metadata("design:returntype", void 0)
], RadiostationController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get Single Radio Station' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RadiostationController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id/stop-listening-stream'),
    (0, decorators_1.RolesAllowed)(Enums_1.Roles.ADMIN),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, guards_1.RoleBasedGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'stop listening stream' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RadiostationController.prototype, "stopListeningStream", null);
__decorate([
    (0, common_1.Put)(':id/start-listening-stream'),
    (0, decorators_1.RolesAllowed)(Enums_1.Roles.ADMIN),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, guards_1.RoleBasedGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'start listening stream' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RadiostationController.prototype, "startListeningStream", null);
__decorate([
    (0, common_1.Put)('start-listening-stream/bulk'),
    (0, decorators_1.RolesAllowed)(Enums_1.Roles.ADMIN),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, guards_1.RoleBasedGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'stop listening stream' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [bulk_radiostation_dto_1.BulkRadiostationDto]),
    __metadata("design:returntype", void 0)
], RadiostationController.prototype, "bulkStartListeningStream", null);
__decorate([
    (0, common_1.Put)('stop-listening-stream/bulk'),
    (0, decorators_1.RolesAllowed)(Enums_1.Roles.ADMIN),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, guards_1.RoleBasedGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'stop listening stream' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [bulk_radiostation_dto_1.BulkRadiostationDto]),
    __metadata("design:returntype", void 0)
], RadiostationController.prototype, "bulkStopListeningStream", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, decorators_1.RolesAllowed)(Enums_1.Roles.ADMIN),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, guards_1.RoleBasedGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update Single Radio Station' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, user_decorator_1.User)('sub')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, update_radiostation_dto_1.UpdateRadiostationDto]),
    __metadata("design:returntype", Promise)
], RadiostationController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)('delete/bulk'),
    (0, decorators_1.RolesAllowed)(Enums_1.Roles.ADMIN),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, guards_1.RoleBasedGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Delete Radio Station in bulk' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [bulk_radiostation_dto_1.BulkRadiostationDto]),
    __metadata("design:returntype", void 0)
], RadiostationController.prototype, "removeBulk", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, decorators_1.RolesAllowed)(Enums_1.Roles.ADMIN),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, guards_1.RoleBasedGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Delete Radio Station' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RadiostationController.prototype, "remove", null);
RadiostationController = __decorate([
    (0, swagger_1.ApiTags)('Radio Station Controller'),
    (0, common_1.Controller)('radiostations'),
    __metadata("design:paramtypes", [radiostation_service_1.RadiostationService])
], RadiostationController);
exports.RadiostationController = RadiostationController;
//# sourceMappingURL=radiostation.controller.js.map