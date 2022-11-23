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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DetectionOwnerController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const detection_service_1 = require("../detection.service");
const sonickey_service_1 = require("../../sonickey/services/sonickey.service");
const swagger_1 = require("@nestjs/swagger");
const Enums_1 = require("../../../constants/Enums");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const parseQueryValue_pipe_1 = require("../../../shared/pipes/parseQueryValue.pipe");
const parsedquery_dto_1 = require("../../../shared/dtos/parsedquery.dto");
const anyapiquerytemplate_decorator_1 = require("../../../shared/decorators/anyapiquerytemplate.decorator");
const isTargetUserLoggedIn_guard_1 = require("../../auth/guards/isTargetUserLoggedIn.guard");
const types_1 = require("../../../shared/types");
const conditional_auth_guard_1 = require("../../auth/guards/conditional-auth.guard");
const file_handler_service_1 = require("../../../shared/services/file-handler.service");
const utils_1 = require("../../../shared/utils");
const _ = require("lodash");
const user_decorator_1 = require("../../auth/decorators/user.decorator");
const user_db_schema_1 = require("../../user/schemas/user.db.schema");
const mongoose_utils_1 = require("../../../shared/utils/mongoose.utils");
let DetectionOwnerController = class DetectionOwnerController {
    constructor(detectionService, sonickeyServive, fileHandlerService) {
        this.detectionService = detectionService;
        this.sonickeyServive = sonickeyServive;
        this.fileHandlerService = fileHandlerService;
    }
    async getPlaysDashboardData(targetUser, queryDto) {
        var { filter } = queryDto;
        filter['owner'] = targetUser;
        return this.detectionService.getPlaysDashboardData(filter);
    }
    async getMonitorDashboardData(targetUser, user, queryDto) {
        var includeCompanies = queryDto.filter['includeCompanies'];
        delete queryDto.filter['includeCompanies'];
        const userCompaniesIds = user.companies.map(com => mongoose_utils_1.toObjectId(com._id));
        if (includeCompanies == false) {
            queryDto.relationalFilter = _.merge({}, queryDto.relationalFilter, {
                $or: [{ 'owner._id': user._id }],
            });
        }
        else {
            queryDto.relationalFilter = _.merge({}, queryDto.relationalFilter, {
                $or: [
                    { 'owner._id': user._id },
                    { 'owner.companies': { $in: userCompaniesIds } },
                ],
            });
        }
        return this.detectionService.getMonitorDashboardData(queryDto);
    }
    async getPlaysDashboardGraphData(targetUser, queryDto) {
        var { filter } = queryDto;
        filter['owner'] = targetUser;
        return this.detectionService.getPlaysDashboardGraphData(filter);
    }
    async getTopRadiostations(targetUser, queryDto) {
        var e_1, _a;
        const { topLimit = 3, includeGraph, groupByTime, filter } = queryDto;
        const graph_detectedAt = filter.graph_detectedAt;
        delete filter.graph_detectedAt;
        const topStationsWithSonicKeys = await this.detectionService.findTopRadioStationsWithSonicKeysForOwner(targetUser, topLimit, filter);
        if (includeGraph) {
            if (!groupByTime)
                throw new common_1.BadRequestException('groupByTime query params required for includeGraph type');
            var topStationsWithTopKeysAndGraphs = [];
            if (graph_detectedAt) {
                filter['detectedAt'] = graph_detectedAt;
            }
            console.log('filter in graph', filter);
            try {
                for (var topStationsWithSonicKeys_1 = __asyncValues(topStationsWithSonicKeys), topStationsWithSonicKeys_1_1; topStationsWithSonicKeys_1_1 = await topStationsWithSonicKeys_1.next(), !topStationsWithSonicKeys_1_1.done;) {
                    const station = topStationsWithSonicKeys_1_1.value;
                    const graphs = await this.detectionService.findGraphOfSonicKeysForRadioStationInSpecificTime(station._id, groupByTime, filter);
                    station['graphsData'] = graphs;
                    topStationsWithTopKeysAndGraphs.push(station);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (topStationsWithSonicKeys_1_1 && !topStationsWithSonicKeys_1_1.done && (_a = topStationsWithSonicKeys_1.return)) await _a.call(topStationsWithSonicKeys_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return topStationsWithTopKeysAndGraphs;
        }
        return topStationsWithSonicKeys;
    }
    async getTopRadiostationsWithPlays(targetUser, queryDto) {
        const { topLimit = 5 } = queryDto;
        const topStationsWithPlaysDetails = await this.detectionService.findTopRadioStationsWithPlaysCountForOwner(topLimit, queryDto);
        return topStationsWithPlaysDetails;
    }
    async getSonicKeyGraphs(targetUser, radioStation, time, queryDto) {
        const { filter } = queryDto;
        return this.detectionService.findGraphOfSonicKeysForRadioStationInSpecificTime(radioStation, time, Object.assign(Object.assign({}, filter), { owner: targetUser }));
    }
    findAll(targetUser, channel, queryDto) {
        if (channel !== 'ALL') {
            queryDto.filter['channel'] = channel;
        }
        queryDto.filter['owner'] = targetUser;
        return this.detectionService.findAll(queryDto, true);
    }
    async exportDashboardPlaysView(res, targetUser, format, queryDto) {
        if (!['xlsx', 'csv'].includes(format))
            throw new common_1.BadRequestException('unsupported format');
        queryDto.filter['owner'] = targetUser;
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
        queryDto.filter['owner'] = targetUser;
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
    listPlays(targetUser, user, queryDto) {
        const playsBy = queryDto.filter['playsBy'];
        var includeCompanies = queryDto.filter['includeCompanies'];
        delete queryDto.filter['playsBy'];
        delete queryDto.filter['includeCompanies'];
        const userCompaniesIds = user.companies.map(com => mongoose_utils_1.toObjectId(com._id));
        if (includeCompanies == false) {
            queryDto.relationalFilter = _.merge({}, queryDto.relationalFilter, {
                $or: [{ 'owner._id': user._id }],
            });
        }
        else {
            queryDto.relationalFilter = _.merge({}, queryDto.relationalFilter, {
                $or: [
                    { 'owner._id': user._id },
                    { 'owner.companies': { $in: userCompaniesIds } },
                ],
            });
        }
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
    getPlaysCountBy(targetUser, user, queryDto) {
        const playsBy = queryDto.filter['playsBy'];
        var includeCompanies = queryDto.filter['includeCompanies'];
        delete queryDto.filter['playsBy'];
        delete queryDto.filter['includeCompanies'];
        const userCompaniesIds = user.companies.map(com => mongoose_utils_1.toObjectId(com._id));
        if (includeCompanies == false) {
            queryDto.relationalFilter = _.merge({}, queryDto.relationalFilter, {
                $or: [{ 'owner._id': user._id }],
            });
        }
        else {
            queryDto.relationalFilter = _.merge({}, queryDto.relationalFilter, {
                $or: [
                    { 'owner._id': user._id },
                    { 'owner.companies': { $in: userCompaniesIds } },
                ],
            });
        }
        switch (playsBy) {
            case 'ARTISTS':
                return this.detectionService.countPlaysByArtists(queryDto);
            case 'COUNTRIES':
                return this.detectionService.countPlaysByCountries(queryDto);
            case 'TRACKS':
                return this.detectionService.countPlaysByTracks(queryDto);
            case 'RADIOSTATIONS':
                return this.detectionService.countPlaysByRadioStations(queryDto);
            default:
                return this.detectionService.countPlays(queryDto);
        }
    }
    async exportPlaysBy(res, targetUser, user, format, queryDto) {
        if (!['xlsx', 'csv'].includes(format))
            throw new common_1.BadRequestException('unsupported format');
        queryDto.limit = (queryDto === null || queryDto === void 0 ? void 0 : queryDto.limit) <= 2000 ? queryDto === null || queryDto === void 0 ? void 0 : queryDto.limit : 2000;
        const playsBy = queryDto.filter['playsBy'];
        var includeCompanies = queryDto.filter['includeCompanies'];
        delete queryDto.filter['playsBy'];
        delete queryDto.filter['includeCompanies'];
        const userCompaniesIds = user.companies.map(com => mongoose_utils_1.toObjectId(com._id));
        if (includeCompanies == false) {
            queryDto.relationalFilter = _.merge({}, queryDto.relationalFilter, {
                $or: [{ 'owner._id': user._id }],
            });
        }
        else {
            queryDto.relationalFilter = _.merge({}, queryDto.relationalFilter, {
                $or: [
                    { 'owner._id': user._id },
                    { 'owner.companies': { $in: userCompaniesIds } },
                ],
            });
        }
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
    getDetectedDetailsOfSingleSonicKey(targetUser, channel, sonicKey, queryDto) {
        if (channel !== 'ALL') {
            queryDto.filter['channel'] = channel;
        }
        queryDto.filter['owner'] = targetUser;
        queryDto.filter['sonicKey'] = sonicKey;
        return this.detectionService.findAll(queryDto);
    }
    getCount(targetUser, channel, queryDto) {
        if (channel !== 'ALL') {
            queryDto.filter['channel'] = channel;
        }
        queryDto.filter['owner'] = targetUser;
        return this.detectionService.getTotalHitsCount(queryDto);
    }
    getPlaysCount(targetUser, channel, queryDto) {
        if (channel !== 'ALL') {
            queryDto.filter['channel'] = channel;
        }
        queryDto.filter['owner'] = targetUser;
        return this.detectionService.getTotalPlaysCount(queryDto);
    }
};
__decorate([
    common_1.Get('/plays-dashboard-data'),
    anyapiquerytemplate_decorator_1.AnyApiQueryTemplate(),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard, new isTargetUserLoggedIn_guard_1.IsTargetUserLoggedInGuard('Param')),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({ summary: 'Get Plays Dashboard data' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, common_1.Param('targetUser')),
    __param(1, common_1.Query(new parseQueryValue_pipe_1.ParseQueryValue())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, parsedquery_dto_1.ParsedQueryDto]),
    __metadata("design:returntype", Promise)
], DetectionOwnerController.prototype, "getPlaysDashboardData", null);
__decorate([
    common_1.Get('/get-monitor-dashboard-data'),
    swagger_1.ApiQuery({ name: 'includeCompanies', type: Boolean, required: false }),
    anyapiquerytemplate_decorator_1.AnyApiQueryTemplate(),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard, new isTargetUserLoggedIn_guard_1.IsTargetUserLoggedInGuard('Param')),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({ summary: 'Get Monitor Dashboard data' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, common_1.Param('targetUser')),
    __param(1, user_decorator_1.User()),
    __param(2, common_1.Query(new parseQueryValue_pipe_1.ParseQueryValue())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_db_schema_1.UserDB,
        parsedquery_dto_1.ParsedQueryDto]),
    __metadata("design:returntype", Promise)
], DetectionOwnerController.prototype, "getMonitorDashboardData", null);
__decorate([
    common_1.Get('/plays-dashboard-graph-data'),
    anyapiquerytemplate_decorator_1.AnyApiQueryTemplate(),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard, new isTargetUserLoggedIn_guard_1.IsTargetUserLoggedInGuard('Param')),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({ summary: 'Get Plays Dashboard graph data' }),
    openapi.ApiResponse({ status: 200, type: require("../dto/general.dto").PlaysGraphResponseDto }),
    __param(0, common_1.Param('targetUser')),
    __param(1, common_1.Query(new parseQueryValue_pipe_1.ParseQueryValue())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, parsedquery_dto_1.ParsedQueryDto]),
    __metadata("design:returntype", Promise)
], DetectionOwnerController.prototype, "getPlaysDashboardGraphData", null);
__decorate([
    common_1.Get(`/radioStations/top-radiostations-with-top-sonickeys`),
    anyapiquerytemplate_decorator_1.AnyApiQueryTemplate({
        additionalHtmlDescription: `
  <fieldset>
  <legend><h1>Example:</h1></legend>
  <code><small>BASE_URL/detections/owners/:targetUser/top-radiostations-with-top-sonickeys?detectedAt<2021-06-30&detectedAt>2021-06-01</small></code>
 <br/>
 <h4>Example including Graph</h4>
 <code><small>BASE_URL/detections/owners/:targetUser/top-radiostations-with-top-sonickeys?detectedAt<2021-06-30&detectedAt>2021-06-01&includeGraph=true&groupByTime=month</small></code>
  </fieldset>
 `,
    }),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard, new isTargetUserLoggedIn_guard_1.IsTargetUserLoggedInGuard('Param')),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiQuery({ name: 'includeGraph', type: Boolean, required: false }),
    swagger_1.ApiQuery({
        name: 'groupByTime',
        enum: ['month', 'year', 'dayOfMonth'],
        required: false,
    }),
    swagger_1.ApiOperation({ summary: 'Get Top radiostations with top sonickeys' }),
    openapi.ApiResponse({ status: 200, type: [require("../dto/general.dto").TopRadioStationWithTopSonicKey] }),
    __param(0, common_1.Param('targetUser')),
    __param(1, common_1.Query(new parseQueryValue_pipe_1.ParseQueryValue())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, parsedquery_dto_1.ParsedQueryDto]),
    __metadata("design:returntype", Promise)
], DetectionOwnerController.prototype, "getTopRadiostations", null);
__decorate([
    common_1.Get(`/radioStations/top-radiostations-with-plays-details`),
    anyapiquerytemplate_decorator_1.AnyApiQueryTemplate({
        additionalHtmlDescription: `
  <fieldset>
  <legend><h1>Example:</h1></legend>
  <code><small>BASE_URL/detections/owners/:targetUser/top-radiostations-with-plays-details?detectedAt<2021-06-30&detectedAt>2021-06-01</small></code>
  </fieldset>
 `,
    }),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard, new isTargetUserLoggedIn_guard_1.IsTargetUserLoggedInGuard('Param')),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({ summary: 'Get Top radiostations with its plays details' }),
    openapi.ApiResponse({ status: 200, type: [require("../dto/general.dto").TopRadioStationWithPlaysDetails] }),
    __param(0, common_1.Param('targetUser')),
    __param(1, common_1.Query(new parseQueryValue_pipe_1.ParseQueryValue())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, parsedquery_dto_1.ParsedQueryDto]),
    __metadata("design:returntype", Promise)
], DetectionOwnerController.prototype, "getTopRadiostationsWithPlays", null);
__decorate([
    common_1.Get('/radioStations/:radioStation/sonickey-graph/:groupByTime'),
    swagger_1.ApiParam({ name: 'groupByTime', enum: ['month', 'year', 'dayOfMonth'] }),
    anyapiquerytemplate_decorator_1.AnyApiQueryTemplate({
        additionalHtmlDescription: `
  <fieldset>
  <legend><h1>Example:</h1></legend>
  <code><small>BASE_URL/detections/owners/:targetUser/radioStations/:radioStation/sonickey-graph/:groupByTime?detectedAt<2021-06-30&detectedAt>2021-06-01</small></code>
  </fieldset>
 `,
    }),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard, new isTargetUserLoggedIn_guard_1.IsTargetUserLoggedInGuard('Param')),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({ summary: 'Get Top radiostations with top sonickeys' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, common_1.Param('targetUser')),
    __param(1, common_1.Param('radioStation')),
    __param(2, common_1.Param('groupByTime')),
    __param(3, common_1.Query(new parseQueryValue_pipe_1.ParseQueryValue())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, parsedquery_dto_1.ParsedQueryDto]),
    __metadata("design:returntype", Promise)
], DetectionOwnerController.prototype, "getSonicKeyGraphs", null);
__decorate([
    common_1.Get('/:channel/data'),
    swagger_1.ApiQuery({ name: 'radioStation', type: String, required: false }),
    swagger_1.ApiParam({ name: 'channel', enum: [...Object.values(Enums_1.ChannelEnums), 'ALL'] }),
    common_1.UseGuards(conditional_auth_guard_1.ConditionalAuthGuard, new isTargetUserLoggedIn_guard_1.IsTargetUserLoggedInGuard('Param')),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiSecurity('x-api-key'),
    swagger_1.ApiQuery({ name: 'includeGroupData', type: Boolean, required: false }),
    anyapiquerytemplate_decorator_1.AnyApiQueryTemplate(),
    swagger_1.ApiOperation({
        summary: 'Get All Detections for specific channel and specific user',
    }),
    openapi.ApiResponse({ status: 200, type: require("../dto/mongoosepaginate-radiostationsonickey.dto").MongoosePaginateDetectionDto }),
    __param(0, common_1.Param('targetUser')),
    __param(1, common_1.Param('channel')),
    __param(2, common_1.Query(new parseQueryValue_pipe_1.ParseQueryValue())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, parsedquery_dto_1.ParsedQueryDto]),
    __metadata("design:returntype", void 0)
], DetectionOwnerController.prototype, "findAll", null);
__decorate([
    common_1.Get('/export/dashboard-plays-view/:format'),
    swagger_1.ApiParam({ name: 'format', enum: ['xlsx', 'csv'] }),
    common_1.UseGuards(conditional_auth_guard_1.ConditionalAuthGuard, new isTargetUserLoggedIn_guard_1.IsTargetUserLoggedInGuard('Param')),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiSecurity('x-api-key'),
    anyapiquerytemplate_decorator_1.AnyApiQueryTemplate(),
    swagger_1.ApiOperation({ summary: 'Export Dashboard Plays View' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, common_1.Res()),
    __param(1, common_1.Param('targetUser')),
    __param(2, common_1.Param('format')),
    __param(3, common_1.Query(new parseQueryValue_pipe_1.ParseQueryValue())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, parsedquery_dto_1.ParsedQueryDto]),
    __metadata("design:returntype", Promise)
], DetectionOwnerController.prototype, "exportDashboardPlaysView", null);
__decorate([
    common_1.Get('/export/history-of-sonickey/:format'),
    swagger_1.ApiParam({ name: 'format', enum: ['xlsx', 'csv'] }),
    swagger_1.ApiQuery({ name: 'radioStation', type: String, required: false }),
    swagger_1.ApiQuery({ name: 'limit', type: Number, required: false }),
    swagger_1.ApiQuery({ name: 'sonicKey', type: String, required: false }),
    swagger_1.ApiQuery({
        name: 'channel',
        enum: [...Object.values(Enums_1.ChannelEnums), 'ALL'],
        required: false,
    }),
    common_1.UseGuards(conditional_auth_guard_1.ConditionalAuthGuard, new isTargetUserLoggedIn_guard_1.IsTargetUserLoggedInGuard('Param')),
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
], DetectionOwnerController.prototype, "exportHistoryOfSonicKeyView", null);
__decorate([
    common_1.Get('/list-plays'),
    swagger_1.ApiQuery({
        name: 'playsBy',
        enum: ['ARTISTS', 'COUNTRIES', 'TRACKS', 'RADIOSTATIONS'],
        required: false,
    }),
    swagger_1.ApiQuery({ name: 'includeCompanies', type: Boolean, required: false }),
    swagger_1.ApiQuery({ name: 'radioStation', type: String, required: false }),
    swagger_1.ApiQuery({ name: 'limit', type: Number, required: false }),
    swagger_1.ApiQuery({
        name: 'channel',
        enum: [...Object.values(Enums_1.ChannelEnums), 'ALL'],
        required: false,
    }),
    common_1.UseGuards(conditional_auth_guard_1.ConditionalAuthGuard, new isTargetUserLoggedIn_guard_1.IsTargetUserLoggedInGuard('Param')),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiSecurity('x-api-key'),
    anyapiquerytemplate_decorator_1.AnyApiQueryTemplate(),
    swagger_1.ApiOperation({
        summary: 'Get All Plays for specific user by specific groupBy Aggregation',
    }),
    __param(0, common_1.Param('targetUser')),
    __param(1, user_decorator_1.User()),
    __param(2, common_1.Query(new parseQueryValue_pipe_1.ParseQueryValue())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_db_schema_1.UserDB,
        parsedquery_dto_1.ParsedQueryDto]),
    __metadata("design:returntype", void 0)
], DetectionOwnerController.prototype, "listPlays", null);
__decorate([
    common_1.Get('/get-plays-count-by'),
    swagger_1.ApiQuery({
        name: 'playsBy',
        enum: ['ARTISTS', 'COUNTRIES', 'TRACKS', 'RADIOSTATIONS'],
        required: false,
    }),
    swagger_1.ApiQuery({ name: 'includeCompanies', type: Boolean, required: false }),
    swagger_1.ApiQuery({ name: 'radioStation', type: String, required: false }),
    swagger_1.ApiQuery({ name: 'limit', type: Number, required: false }),
    swagger_1.ApiQuery({
        name: 'channel',
        enum: [...Object.values(Enums_1.ChannelEnums), 'ALL'],
        required: false,
    }),
    common_1.UseGuards(conditional_auth_guard_1.ConditionalAuthGuard, new isTargetUserLoggedIn_guard_1.IsTargetUserLoggedInGuard('Param')),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiSecurity('x-api-key'),
    anyapiquerytemplate_decorator_1.AnyApiQueryTemplate(),
    swagger_1.ApiOperation({
        summary: 'Get  Plays count for specific user by specific groupBy Aggregation',
    }),
    openapi.ApiResponse({ status: 200, type: Number }),
    __param(0, common_1.Param('targetUser')),
    __param(1, user_decorator_1.User()),
    __param(2, common_1.Query(new parseQueryValue_pipe_1.ParseQueryValue())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_db_schema_1.UserDB,
        parsedquery_dto_1.ParsedQueryDto]),
    __metadata("design:returntype", void 0)
], DetectionOwnerController.prototype, "getPlaysCountBy", null);
__decorate([
    common_1.Get('/export-plays-by/:format'),
    swagger_1.ApiQuery({
        name: 'playsBy',
        enum: ['ARTISTS', 'COUNTRIES', 'TRACKS', 'RADIOSTATIONS'],
        required: false,
    }),
    swagger_1.ApiParam({ name: 'format', enum: ['xlsx', 'csv'] }),
    common_1.UseGuards(conditional_auth_guard_1.ConditionalAuthGuard, new isTargetUserLoggedIn_guard_1.IsTargetUserLoggedInGuard('Param')),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiSecurity('x-api-key'),
    anyapiquerytemplate_decorator_1.AnyApiQueryTemplate(),
    swagger_1.ApiOperation({ summary: 'Export Plays View' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, common_1.Res()),
    __param(1, common_1.Param('targetUser')),
    __param(2, user_decorator_1.User()),
    __param(3, common_1.Param('format')),
    __param(4, common_1.Query(new parseQueryValue_pipe_1.ParseQueryValue())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, user_db_schema_1.UserDB, String, parsedquery_dto_1.ParsedQueryDto]),
    __metadata("design:returntype", Promise)
], DetectionOwnerController.prototype, "exportPlaysBy", null);
__decorate([
    common_1.Get('/:channel/sonicKeys/:sonicKey/detected-details'),
    swagger_1.ApiQuery({ name: 'radioStation', type: String, required: false }),
    swagger_1.ApiQuery({ name: 'includeGroupData', type: Boolean, required: false }),
    swagger_1.ApiParam({ name: 'channel', enum: [...Object.values(Enums_1.ChannelEnums), 'ALL'] }),
    common_1.UseGuards(conditional_auth_guard_1.ConditionalAuthGuard, new isTargetUserLoggedIn_guard_1.IsTargetUserLoggedInGuard('Param')),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiSecurity('x-api-key'),
    anyapiquerytemplate_decorator_1.AnyApiQueryTemplate(),
    swagger_1.ApiOperation({
        summary: 'Get Detected Details for specific channel and specific sonickey',
    }),
    openapi.ApiResponse({ status: 200, type: require("../dto/mongoosepaginate-radiostationsonickey.dto").MongoosePaginateDetectionDto }),
    __param(0, common_1.Param('targetUser')),
    __param(1, common_1.Param('channel')),
    __param(2, common_1.Param('sonicKey')),
    __param(3, common_1.Query(new parseQueryValue_pipe_1.ParseQueryValue())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, parsedquery_dto_1.ParsedQueryDto]),
    __metadata("design:returntype", void 0)
], DetectionOwnerController.prototype, "getDetectedDetailsOfSingleSonicKey", null);
__decorate([
    common_1.Get('/:channel/count'),
    swagger_1.ApiQuery({ name: 'includeGroupData', type: Boolean, required: false }),
    swagger_1.ApiQuery({ name: 'radioStation', type: String, required: false }),
    swagger_1.ApiParam({ name: 'channel', enum: [...Object.values(Enums_1.ChannelEnums), 'ALL'] }),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard, new isTargetUserLoggedIn_guard_1.IsTargetUserLoggedInGuard('Param')),
    swagger_1.ApiBearerAuth(),
    anyapiquerytemplate_decorator_1.AnyApiQueryTemplate({
        additionalHtmlDescription: `
  <fieldset>
  <legend><h1>Example:</h1></legend>
  <code><small>BASE_URL/detections/owners/:targetUser/:channel/count/?detectedAt<2021-06-30&detectedAt>2021-06-01</small></code>
 <br/>
 <h4>OR For Specific RadioStation</h4>
 <code><small>BASE_URL/detections/owners/:targetUser/:channel/count/?detectedAt<2021-06-30&detectedAt>2021-06-01&radioStation=609cd75081fe3a15732162ef</small></code>
  </fieldset>
 `,
    }),
    swagger_1.ApiOperation({ summary: 'Get Count' }),
    swagger_1.ApiQuery({ name: 'includeGroupData', type: Boolean, required: false }),
    openapi.ApiResponse({ status: 200, type: Number }),
    __param(0, common_1.Param('targetUser')),
    __param(1, common_1.Param('channel')),
    __param(2, common_1.Query(new parseQueryValue_pipe_1.ParseQueryValue())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, parsedquery_dto_1.ParsedQueryDto]),
    __metadata("design:returntype", void 0)
], DetectionOwnerController.prototype, "getCount", null);
__decorate([
    common_1.Get('/:channel/count-plays'),
    swagger_1.ApiQuery({ name: 'includeGroupData', type: Boolean, required: false }),
    swagger_1.ApiQuery({ name: 'radioStation', type: String, required: false }),
    swagger_1.ApiParam({ name: 'channel', enum: [...Object.values(Enums_1.ChannelEnums), 'ALL'] }),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard, new isTargetUserLoggedIn_guard_1.IsTargetUserLoggedInGuard('Param')),
    swagger_1.ApiBearerAuth(),
    anyapiquerytemplate_decorator_1.AnyApiQueryTemplate({
        additionalHtmlDescription: `
  <fieldset>
  <legend><h1>Example:</h1></legend>
  <code><small>BASE_URL/detections/owners/:targetUser/:channel/count-plays/?detectedAt<2021-06-30&detectedAt>2021-06-01</small></code>
 <br/>
 <h4>OR For Specific RadioStation</h4>
 <code><small>BASE_URL/detections/owners/:targetUser/:channel/count-plays/?detectedAt<2021-06-30&detectedAt>2021-06-01&radioStation=609cd75081fe3a15732162ef</small></code>
  </fieldset>
 `,
    }),
    swagger_1.ApiOperation({ summary: 'Get Plays Count' }),
    openapi.ApiResponse({ status: 200, type: require("../dto/general.dto").PlaysCountResponseDto }),
    __param(0, common_1.Param('targetUser')),
    __param(1, common_1.Param('channel')),
    __param(2, common_1.Query(new parseQueryValue_pipe_1.ParseQueryValue())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, parsedquery_dto_1.ParsedQueryDto]),
    __metadata("design:returntype", void 0)
], DetectionOwnerController.prototype, "getPlaysCount", null);
DetectionOwnerController = __decorate([
    swagger_1.ApiTags('Detection Controller'),
    common_1.Controller('detections/owners/:targetUser'),
    __metadata("design:paramtypes", [detection_service_1.DetectionService,
        sonickey_service_1.SonickeyService,
        file_handler_service_1.FileHandlerService])
], DetectionOwnerController);
exports.DetectionOwnerController = DetectionOwnerController;
//# sourceMappingURL=detection.owner.controller.js.map