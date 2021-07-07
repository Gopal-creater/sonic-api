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
const Channels_enum_1 = require("../../../constants/Channels.enum");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const parseQueryValue_pipe_1 = require("../../../shared/pipes/parseQueryValue.pipe");
const parsedquery_dto_1 = require("../../../shared/dtos/parsedquery.dto");
const anyapiquerytemplate_decorator_1 = require("../../../shared/decorators/anyapiquerytemplate.decorator");
const isTargetUserLoggedIn_guard_1 = require("../../auth/guards/isTargetUserLoggedIn.guard");
const types_1 = require("../../../shared/types");
let DetectionOwnerController = class DetectionOwnerController {
    constructor(detectionService, sonickeyServive) {
        this.detectionService = detectionService;
        this.sonickeyServive = sonickeyServive;
    }
    async getTopRadiostations(targetUser, queryDto) {
        var e_1, _a;
        const { topLimit = 3, includeGraph, groupByTime, filter } = queryDto;
        const topStationsWithSonicKeys = await this.detectionService.findTopRadioStationsWithSonicKeysForOwner(targetUser, topLimit, filter);
        if (includeGraph) {
            if (!groupByTime)
                throw new common_1.BadRequestException("groupByTime query params required for includeGraph type");
            var topStationsWithTopKeysAndGraphs = [];
            try {
                for (var topStationsWithSonicKeys_1 = __asyncValues(topStationsWithSonicKeys), topStationsWithSonicKeys_1_1; topStationsWithSonicKeys_1_1 = await topStationsWithSonicKeys_1.next(), !topStationsWithSonicKeys_1_1.done;) {
                    const station = topStationsWithSonicKeys_1_1.value;
                    const graphs = await this.detectionService.findGraphOfSonicKeysForRadioStationInSpecificTime(station._id, groupByTime, filter);
                    station['graphs'] = graphs;
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
    findAll(targetUser, channel, queryDto) {
        if (channel !== 'ALL') {
            queryDto.filter['channel'] = channel;
        }
        queryDto.filter['owner'] = targetUser;
        return this.detectionService.findAll(queryDto);
    }
    async getSonicKeyGraphs(targetUser, radioStation, time, queryDto) {
        const { filter } = queryDto;
        return this.detectionService.findGraphOfSonicKeysForRadioStationInSpecificTime(radioStation, time, Object.assign(Object.assign({}, filter), { owner: targetUser }));
    }
    getCount(targetUser, channel, queryDto) {
        if (channel !== 'ALL') {
            queryDto.filter['channel'] = channel;
        }
        queryDto.filter['owner'] = targetUser;
        const filter = queryDto.filter || {};
        return this.detectionService.detectionModel.where(filter).countDocuments();
    }
};
__decorate([
    common_1.Get('/:targetUser/top-radiostations-with-top-sonickeys'),
    anyapiquerytemplate_decorator_1.AnyApiQueryTemplate({
        additionalHtmlDescription: `
    <fieldset>
        <legend><h3>Example with graph inclusion:</h3></legend>
    <code><small>BASE_URL/:targetUser/top-radiostations-with-top-sonickeys?detectedAt<2021-06-30&detectedAt>2021-06-01&includeGraph=true&groupByTime=month</small></code>
    </fieldset>
    `
    }),
    swagger_1.ApiQuery({ name: "includeGraph", type: Boolean, required: false }),
    swagger_1.ApiQuery({ name: "groupByTime", enum: ['month', 'year', 'dayOfMonth'], required: false }),
    swagger_1.ApiOperation({ summary: 'Get Top radiostations with top sonickeys' }),
    openapi.ApiResponse({ status: 200, type: [require("../dto/general.dto").TopRadioStationWithTopSonicKey] }),
    __param(0, common_1.Param('targetUser')),
    __param(1, common_1.Query(new parseQueryValue_pipe_1.ParseQueryValue())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, parsedquery_dto_1.ParsedQueryDto]),
    __metadata("design:returntype", Promise)
], DetectionOwnerController.prototype, "getTopRadiostations", null);
__decorate([
    common_1.Get('/:targetUser/:channel'),
    swagger_1.ApiParam({ name: 'channel', enum: [...Object.values(Channels_enum_1.ChannelEnums), 'ALL'] }),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard, new isTargetUserLoggedIn_guard_1.IsTargetUserLoggedInGuard('Param')),
    swagger_1.ApiBearerAuth(),
    anyapiquerytemplate_decorator_1.AnyApiQueryTemplate(),
    swagger_1.ApiOperation({ summary: 'Get All Detections' }),
    openapi.ApiResponse({ status: 200, type: require("../dto/mongoosepaginate-radiostationsonickey.dto").MongoosePaginateDeectionDto }),
    __param(0, common_1.Param('targetUser')),
    __param(1, common_1.Param('channel')),
    __param(2, common_1.Query(new parseQueryValue_pipe_1.ParseQueryValue())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, parsedquery_dto_1.ParsedQueryDto]),
    __metadata("design:returntype", void 0)
], DetectionOwnerController.prototype, "findAll", null);
__decorate([
    common_1.Get('/:targetUser/:radioStation/sonickey-graph/:groupByTime'),
    swagger_1.ApiParam({ name: 'groupByTime', enum: ['month', 'year', 'dayOfMonth'] }),
    anyapiquerytemplate_decorator_1.AnyApiQueryTemplate(),
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
    common_1.Get('/:targetUser/:channel/count'),
    swagger_1.ApiParam({ name: 'channel', enum: [...Object.values(Channels_enum_1.ChannelEnums), 'ALL'] }),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard, new isTargetUserLoggedIn_guard_1.IsTargetUserLoggedInGuard('Param')),
    swagger_1.ApiBearerAuth(),
    anyapiquerytemplate_decorator_1.AnyApiQueryTemplate({
        additionalHtmlDescription: `
        <fieldset>
        <legend><h1>Example with detectedDate:</h1></legend>
        <code><small>BASE_URL/:targetUser/:channel/count/?detectedAt<2021-06-30&detectedAt>2021-06-01</small></code>
          <br/>
      <h4>OR For Specific RadioStation</h4>
      <code><small>BASE_URL/:targetUser/:channel/count/?detectedAt<2021-06-30&detectedAt>2021-06-01&radioStation=609cd75081fe3a15732162ef</small></code>
        </fieldset>
 `,
    }),
    swagger_1.ApiOperation({ summary: 'Get Count' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, common_1.Param('targetUser')),
    __param(1, common_1.Param('channel')),
    __param(2, common_1.Query(new parseQueryValue_pipe_1.ParseQueryValue())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, parsedquery_dto_1.ParsedQueryDto]),
    __metadata("design:returntype", void 0)
], DetectionOwnerController.prototype, "getCount", null);
DetectionOwnerController = __decorate([
    swagger_1.ApiTags('Detection Controller'),
    common_1.Controller('detections'),
    __metadata("design:paramtypes", [detection_service_1.DetectionService,
        sonickey_service_1.SonickeyService])
], DetectionOwnerController);
exports.DetectionOwnerController = DetectionOwnerController;
//# sourceMappingURL=detection.owner.controller.js.map