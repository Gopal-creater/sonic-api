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
exports.DetectionController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const detection_service_1 = require("../detection.service");
const create_detection_dto_1 = require("../dto/create-detection.dto");
const sonickey_service_1 = require("../../sonickey/services/sonickey.service");
const swagger_1 = require("@nestjs/swagger");
const Enums_1 = require("../../../constants/Enums");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const parseQueryValue_pipe_1 = require("../../../shared/pipes/parseQueryValue.pipe");
const parsedquery_dto_1 = require("../../../shared/dtos/parsedquery.dto");
const anyapiquerytemplate_decorator_1 = require("../../../shared/decorators/anyapiquerytemplate.decorator");
const apikey_auth_guard_1 = require("../../auth/guards/apikey-auth.guard");
const apikey_decorator_1 = require("../../api-key/decorators/apikey.decorator");
const role_based_guard_1 = require("../../auth/guards/role-based.guard");
const decorators_1 = require("../../auth/decorators");
const user_db_schema_1 = require("../../user/schemas/user.db.schema");
const conditional_auth_guard_1 = require("../../auth/guards/conditional-auth.guard");
const utils_1 = require("../../../shared/utils");
const file_handler_service_1 = require("../../../shared/services/file-handler.service");
let DetectionController = class DetectionController {
    constructor(detectionService, sonickeyServive, fileHandlerService) {
        this.detectionService = detectionService;
        this.sonickeyServive = sonickeyServive;
        this.fileHandlerService = fileHandlerService;
    }
    listPlays(queryDto) {
        const playsBy = queryDto.filter['playsBy'];
        delete queryDto.filter['playsBy'];
        switch (playsBy) {
            case 'ARTISTS':
                return this.detectionService.listPlaysByArtists(queryDto);
            case 'COUNTRIES':
                return this.detectionService.listPlaysByCountries(queryDto);
            case 'TRACKS':
                return this.detectionService.listPlaysByTracks(queryDto);
            case 'RADIOSTATIONS':
                return this.detectionService.listPlaysByRadioStations(queryDto);
            default:
                return this.detectionService.listPlays(queryDto, queryDto.recentPlays);
        }
    }
    findAll(channel, queryDto) {
        if (channel !== 'ALL') {
            queryDto.filter['channel'] = channel;
        }
        return this.detectionService.getSonicKeysDetails(queryDto, true);
    }
    async getMonitorDashboardData(queryDto) {
        return this.detectionService.getMonitorDashboardData(queryDto);
    }
    async createDetection(createDetectionDto, apiKey) {
        const keyFound = await this.sonickeyServive.findBySonicKey(createDetectionDto.sonicKey);
        if (!keyFound) {
            throw new common_1.NotFoundException('Provided sonickey is not found on our database.');
        }
        if (!createDetectionDto.detectedAt) {
            createDetectionDto.detectedAt = new Date();
        }
        const newDetection = new this.detectionService.detectionModel(Object.assign(Object.assign({}, createDetectionDto), { apiKey: apiKey, owner: keyFound.owner, company: keyFound.owner, partner: keyFound.partner, sonicKeyOwnerId: keyFound.owner, sonicKeyOwnerName: keyFound.contentOwner }));
        return newDetection.save();
    }
    async createFromBinary(createDetectionFromBinaryDto, customer, apiKey) {
        const keyFound = await this.sonickeyServive.findBySonicKey(createDetectionFromBinaryDto.sonicKey);
        if (!keyFound) {
            throw new common_1.NotFoundException('Provided sonickey is not found on our database.');
        }
        if (!createDetectionFromBinaryDto.detectedAt) {
            createDetectionFromBinaryDto.detectedAt = new Date();
        }
        const newDetection = new this.detectionService.detectionModel(Object.assign(Object.assign({}, createDetectionFromBinaryDto), { apiKey: apiKey, owner: keyFound.owner, sonicKeyOwnerId: keyFound.owner, sonicKeyOwnerName: keyFound.contentOwner, channel: Enums_1.ChannelEnums.BINARY }));
        return newDetection.save();
    }
    async createFromHardware(createDetectionFromHardwareDto, customer, apiKey) {
        const keyFound = await this.sonickeyServive.findBySonicKey(createDetectionFromHardwareDto.sonicKey);
        if (!keyFound) {
            throw new common_1.NotFoundException('Provided sonickey is not found on our database.');
        }
        if (!createDetectionFromHardwareDto.detectedAt) {
            createDetectionFromHardwareDto.detectedAt = new Date();
        }
        const newDetection = new this.detectionService.detectionModel(Object.assign(Object.assign({}, createDetectionFromHardwareDto), { apiKey: apiKey, owner: keyFound.owner, company: keyFound.company, partner: keyFound.partner, sonicKeyOwnerId: keyFound.owner, sonicKeyOwnerName: keyFound.contentOwner, channel: Enums_1.ChannelEnums.HARDWARE }));
        return newDetection.save();
    }
    async getTotalHitsCount(queryDto) {
        return this.detectionService.getTotalHitsCount(queryDto);
    }
    async getCount(queryDto) {
        return this.detectionService.getCount(queryDto);
    }
    async getEstimateCount() {
        return this.detectionService.getEstimateCount();
    }
    async delete(detectionId) {
        const deletedDetection = await this.detectionService.detectionModel.findByIdAndRemove(detectionId);
        if (!deletedDetection) {
            throw new common_1.NotFoundException('Given detection id is not found');
        }
        return deletedDetection;
    }
    async exportDashboardPlaysView(res, format, queryDto) {
        if (!['xlsx', 'csv'].includes(format))
            throw new common_1.BadRequestException('Unsupported format');
        queryDto.limit = (queryDto === null || queryDto === void 0 ? void 0 : queryDto.limit) <= 2000 ? queryDto === null || queryDto === void 0 ? void 0 : queryDto.limit : 2000;
        const filePath = await this.detectionService.exportDashboardPlaysView(queryDto, format);
        const fileName = utils_1.extractFileName(filePath);
        res.download(filePath, `exported_dashboard_plays_view_${format}.${fileName.split('.')[1]}`, err => {
            if (err) {
                this.fileHandlerService.deleteFileAtPath(filePath);
                res.send(err);
            }
            this.fileHandlerService.deleteFileAtPath(filePath);
        });
    }
    async exportHistoryOfSonicKeyView(res, targetUser, format, queryDto) {
        queryDto.limit = (queryDto === null || queryDto === void 0 ? void 0 : queryDto.limit) <= 2000 ? queryDto === null || queryDto === void 0 ? void 0 : queryDto.limit : 2000;
        const filePath = await this.detectionService.exportHistoryOfSonicKeyPlays(queryDto, format);
        const fileName = utils_1.extractFileName(filePath);
        res.download(filePath, `exported_history_of_sonickey_${format}.${fileName.split('.')[1]}`, err => {
            if (err) {
                this.fileHandlerService.deleteFileAtPath(filePath);
                res.send(err);
            }
            this.fileHandlerService.deleteFileAtPath(filePath);
        });
    }
    async exportPlaysBy(res, user, format, queryDto) {
        if (!['xlsx', 'csv'].includes(format))
            throw new common_1.BadRequestException('Unsupported format');
        queryDto.limit = (queryDto === null || queryDto === void 0 ? void 0 : queryDto.limit) <= 2000 ? queryDto === null || queryDto === void 0 ? void 0 : queryDto.limit : 2000;
        const playsBy = queryDto.filter['playsBy'];
        delete queryDto.filter['playsBy'];
        var exportedFilePath;
        switch (playsBy) {
            case 'ARTISTS':
                exportedFilePath = await this.detectionService.exportPlaysByArtists(queryDto, format);
                break;
            case 'COUNTRIES':
                exportedFilePath = await this.detectionService.exportPlaysByCountries(queryDto, format);
                break;
            case 'TRACKS':
                exportedFilePath = await this.detectionService.exportPlaysByTracks(queryDto, format);
                break;
            case 'RADIOSTATIONS':
                exportedFilePath = await this.detectionService.exportPlaysByRadioStations(queryDto, format);
                break;
            default:
                exportedFilePath = await this.detectionService.exportPlays(queryDto, format);
                break;
        }
        const fileName = utils_1.extractFileName(exportedFilePath);
        res.download(exportedFilePath, `${fileName.split('_nameseperator_')[1]}`, err => {
            if (err) {
                this.fileHandlerService.deleteFileAtPath(exportedFilePath);
                res.send(err);
            }
            this.fileHandlerService.deleteFileAtPath(exportedFilePath);
        });
    }
};
__decorate([
    common_1.Get('/list-plays'),
    swagger_1.ApiQuery({
        name: 'playsBy',
        enum: ['ARTISTS', 'COUNTRIES', 'TRACKS', 'RADIOSTATIONS'],
        required: false,
    }),
    swagger_1.ApiQuery({ name: 'radioStation', type: String, required: false }),
    swagger_1.ApiQuery({ name: 'limit', type: Number, required: false }),
    swagger_1.ApiQuery({ name: 'recentPlays', type: Boolean, required: false }),
    swagger_1.ApiQuery({
        name: 'channel',
        enum: [...Object.values(Enums_1.ChannelEnums)],
        required: false,
    }),
    decorators_1.RolesAllowed(),
    common_1.UseGuards(conditional_auth_guard_1.ConditionalAuthGuard, role_based_guard_1.RoleBasedGuard),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiSecurity('x-api-key'),
    anyapiquerytemplate_decorator_1.AnyApiQueryTemplate({
        additionalHtmlDescription: `<div>
      To Get plays for specific company ?relation_sonickey.company=companyId <br/>
      To Get plays for specific partner ?relation_sonickey.partner=partnerId <br/>
      To Get plays for specific user ?relation_sonickey.owner=ownerId
    <div>`,
    }),
    swagger_1.ApiOperation({ summary: 'Get All Plays' }),
    __param(0, common_1.Query(new parseQueryValue_pipe_1.ParseQueryValue())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [parsedquery_dto_1.ParsedQueryDto]),
    __metadata("design:returntype", void 0)
], DetectionController.prototype, "listPlays", null);
__decorate([
    common_1.Get('/:channel/data'),
    swagger_1.ApiQuery({ name: 'radioStation', type: String, required: false }),
    swagger_1.ApiParam({ name: 'channel', enum: [...Object.values(Enums_1.ChannelEnums)] }),
    common_1.UseGuards(conditional_auth_guard_1.ConditionalAuthGuard),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiSecurity('x-api-key'),
    swagger_1.ApiQuery({ name: 'includeGroupData', type: Boolean, required: false }),
    anyapiquerytemplate_decorator_1.AnyApiQueryTemplate(),
    swagger_1.ApiOperation({
        summary: 'Get All Detections for specific channel and specific user',
    }),
    openapi.ApiResponse({ status: 200, type: require("../dto/mongoosepaginate-radiostationsonickey.dto").MongoosePaginateDetectionDto }),
    __param(0, common_1.Param('channel')),
    __param(1, common_1.Query(new parseQueryValue_pipe_1.ParseQueryValue())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, parsedquery_dto_1.ParsedQueryDto]),
    __metadata("design:returntype", void 0)
], DetectionController.prototype, "findAll", null);
__decorate([
    common_1.Get('/get-monitor-dashboard-data'),
    anyapiquerytemplate_decorator_1.AnyApiQueryTemplate({
        additionalHtmlDescription: `<div>
      To Get plays for specific company ?relation_sonickey.company=companyId <br/>
      To Get plays for specific partner ?relation_sonickey.partner=partnerId <br/>
      To Get plays for specific user ?relation_sonickey.owner=ownerId
    <div>`,
    }),
    decorators_1.RolesAllowed(),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard, role_based_guard_1.RoleBasedGuard),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({ summary: 'Get Monitor Dashboard data' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, common_1.Query(new parseQueryValue_pipe_1.ParseQueryValue())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [parsedquery_dto_1.ParsedQueryDto]),
    __metadata("design:returntype", Promise)
], DetectionController.prototype, "getMonitorDashboardData", null);
__decorate([
    swagger_1.ApiSecurity('x-api-key'),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({
        summary: '[NEW]: Create Detection from specific channel',
    }),
    common_1.UseGuards(conditional_auth_guard_1.ConditionalAuthGuard),
    common_1.Post(`/create`),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, common_1.Body()),
    __param(1, apikey_decorator_1.ApiKey('_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_detection_dto_1.CreateDetectionDto, String]),
    __metadata("design:returntype", Promise)
], DetectionController.prototype, "createDetection", null);
__decorate([
    swagger_1.ApiSecurity('x-api-key'),
    swagger_1.ApiOperation({
        summary: 'Create Detection From Binary [protected by x-api-key]',
    }),
    common_1.UseGuards(apikey_auth_guard_1.ApiKeyAuthGuard),
    common_1.Post(`/channels/${Enums_1.ChannelEnums.BINARY}`),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, common_1.Body()),
    __param(1, apikey_decorator_1.ApiKey('customer')),
    __param(2, apikey_decorator_1.ApiKey('_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_detection_dto_1.CreateDetectionFromBinaryDto, String, String]),
    __metadata("design:returntype", Promise)
], DetectionController.prototype, "createFromBinary", null);
__decorate([
    swagger_1.ApiSecurity('x-api-key'),
    swagger_1.ApiOperation({
        summary: 'Create Detection From Hardware [protected by x-api-key]',
    }),
    common_1.UseGuards(apikey_auth_guard_1.ApiKeyAuthGuard),
    common_1.Post(`/channels/${Enums_1.ChannelEnums.HARDWARE}`),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, common_1.Body()),
    __param(1, apikey_decorator_1.ApiKey('customer')),
    __param(2, apikey_decorator_1.ApiKey('_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_detection_dto_1.CreateDetectionFromHardwareDto, String, String]),
    __metadata("design:returntype", Promise)
], DetectionController.prototype, "createFromHardware", null);
__decorate([
    common_1.Get('/count'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({
        summary: 'Get count of all detection also accept filter as query params',
    }),
    openapi.ApiResponse({ status: 200, type: Number }),
    __param(0, common_1.Query(new parseQueryValue_pipe_1.ParseQueryValue())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [parsedquery_dto_1.ParsedQueryDto]),
    __metadata("design:returntype", Promise)
], DetectionController.prototype, "getTotalHitsCount", null);
__decorate([
    common_1.Get('/count'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    anyapiquerytemplate_decorator_1.AnyApiQueryTemplate(),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({
        summary: 'Get count of all detections also accept filter as query params',
    }),
    openapi.ApiResponse({ status: 200, type: Number }),
    __param(0, common_1.Query(new parseQueryValue_pipe_1.ParseQueryValue())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [parsedquery_dto_1.ParsedQueryDto]),
    __metadata("design:returntype", Promise)
], DetectionController.prototype, "getCount", null);
__decorate([
    common_1.Get('/estimate-count'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({
        summary: 'Get all count of all detections',
    }),
    openapi.ApiResponse({ status: 200, type: Number }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DetectionController.prototype, "getEstimateCount", null);
__decorate([
    common_1.Delete('/:detectionId'),
    decorators_1.RolesAllowed(Enums_1.Roles.ADMIN),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard, role_based_guard_1.RoleBasedGuard),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({ summary: 'Delete Detection data' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, common_1.Param('detectionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DetectionController.prototype, "delete", null);
__decorate([
    common_1.Get('/export/dashboard-plays-view/:format'),
    swagger_1.ApiParam({ name: 'format', enum: ['xlsx', 'csv'] }),
    common_1.UseGuards(conditional_auth_guard_1.ConditionalAuthGuard),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiSecurity('x-api-key'),
    anyapiquerytemplate_decorator_1.AnyApiQueryTemplate(),
    swagger_1.ApiOperation({ summary: 'Export Dashboard Plays View' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, common_1.Res()),
    __param(1, common_1.Param('format')),
    __param(2, common_1.Query(new parseQueryValue_pipe_1.ParseQueryValue())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, parsedquery_dto_1.ParsedQueryDto]),
    __metadata("design:returntype", Promise)
], DetectionController.prototype, "exportDashboardPlaysView", null);
__decorate([
    common_1.Get('/export/history-of-sonickey/:format'),
    swagger_1.ApiParam({ name: 'format', enum: ['xlsx', 'csv'] }),
    swagger_1.ApiQuery({ name: 'radioStation', type: String, required: false }),
    swagger_1.ApiQuery({ name: 'limit', type: Number, required: false }),
    swagger_1.ApiQuery({ name: 'sonicKey', type: String, required: false }),
    swagger_1.ApiQuery({
        name: 'channel',
        enum: [...Object.values(Enums_1.ChannelEnums)],
        required: false,
    }),
    common_1.UseGuards(conditional_auth_guard_1.ConditionalAuthGuard),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiSecurity('x-api-key'),
    anyapiquerytemplate_decorator_1.AnyApiQueryTemplate(),
    swagger_1.ApiOperation({ summary: 'Export History Of Sonickey View' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, common_1.Res()),
    __param(1, common_1.Param('targetUser')),
    __param(2, common_1.Param('format')),
    __param(3, common_1.Query(new parseQueryValue_pipe_1.ParseQueryValue())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, parsedquery_dto_1.ParsedQueryDto]),
    __metadata("design:returntype", Promise)
], DetectionController.prototype, "exportHistoryOfSonicKeyView", null);
__decorate([
    common_1.Get('/export-plays-by/:format'),
    swagger_1.ApiQuery({
        name: 'playsBy',
        enum: ['ARTISTS', 'COUNTRIES', 'TRACKS', 'RADIOSTATIONS'],
        required: false,
    }),
    swagger_1.ApiParam({ name: 'format', enum: ['xlsx', 'csv'] }),
    common_1.UseGuards(conditional_auth_guard_1.ConditionalAuthGuard),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiSecurity('x-api-key'),
    anyapiquerytemplate_decorator_1.AnyApiQueryTemplate(),
    swagger_1.ApiOperation({ summary: 'Export Plays View' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, common_1.Res()),
    __param(1, decorators_1.User()),
    __param(2, common_1.Param('format')),
    __param(3, common_1.Query(new parseQueryValue_pipe_1.ParseQueryValue())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, user_db_schema_1.UserDB, String, parsedquery_dto_1.ParsedQueryDto]),
    __metadata("design:returntype", Promise)
], DetectionController.prototype, "exportPlaysBy", null);
DetectionController = __decorate([
    swagger_1.ApiTags('Detection Controller'),
    common_1.Controller('detections'),
    __metadata("design:paramtypes", [detection_service_1.DetectionService,
        sonickey_service_1.SonickeyService,
        file_handler_service_1.FileHandlerService])
], DetectionController);
exports.DetectionController = DetectionController;
//# sourceMappingURL=detection.controller.js.map