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
exports.RadiostationSonicKeysController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const radiostation_service_1 = require("../services/radiostation.service");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const radiostation_sonickeys_service_1 = require("../services/radiostation-sonickeys.service");
const parseQueryValue_pipe_1 = require("../../../shared/pipes/parseQueryValue.pipe");
const parsedquery_dto_1 = require("../../../shared/dtos/parsedquery.dto");
const anyapiquerytemplate_decorator_1 = require("../../../shared/decorators/anyapiquerytemplate.decorator");
const toObjectId_pipe_1 = require("../../../shared/pipes/toObjectId.pipe");
let RadiostationSonicKeysController = class RadiostationSonicKeysController {
    constructor(radiostationService, radiostationSonicKeysService) {
        this.radiostationService = radiostationService;
        this.radiostationSonicKeysService = radiostationSonicKeysService;
    }
    async getOwnersRadioStationsSonicKeys(targetUser, queryDto) {
        queryDto.filter['owner'] = targetUser;
        return this.radiostationSonicKeysService.findAll(queryDto);
    }
    async retriveDashboardCountData(targetUser, queryDto) {
        var _a;
        const { filter } = queryDto;
        const detectedKeys = await this.radiostationSonicKeysService.radioStationSonickeyModel.aggregate([
            { $match: Object.assign(Object.assign({}, filter), { owner: targetUser }) },
            { $group: { _id: null, totalKeys: { $sum: '$count' } } },
        ]);
        return ((_a = detectedKeys === null || detectedKeys === void 0 ? void 0 : detectedKeys[0]) === null || _a === void 0 ? void 0 : _a.totalKeys) || 0;
    }
    async retriveDashboardChartData(targetUser, radioStation, queryDto) {
        const { filter } = queryDto;
        const detectedKeys = await this.radiostationSonicKeysService.radioStationSonickeyModel.aggregate([
            {
                $match: Object.assign(Object.assign({}, filter), { owner: targetUser, radioStation: radioStation }),
            },
        ]);
        return detectedKeys;
    }
    async retriveDashboardTopStationsData(targetUser, queryDto) {
        const { topLimit, filter } = queryDto;
        return this.radiostationSonicKeysService.findTopRadioStations(Object.assign(Object.assign({}, filter), { owner: targetUser }), topLimit || 3);
    }
    async retriveDashboardTopStationsWithTopSonciKeysData(targetUser, queryDto) {
        var e_1, _a;
        const { topLimit = 3, filter } = queryDto;
        const top3RadioStations = await this.radiostationSonicKeysService.findTopRadioStations(Object.assign(Object.assign({}, filter), { owner: targetUser }), topLimit);
        var responseDataWithStationAndKeys = [];
        try {
            for (var top3RadioStations_1 = __asyncValues(top3RadioStations), top3RadioStations_1_1; top3RadioStations_1_1 = await top3RadioStations_1.next(), !top3RadioStations_1_1.done;) {
                const radioStation = top3RadioStations_1_1.value;
                const data = await this.radiostationSonicKeysService.radioStationSonickeyModel
                    .find({ radioStation: radioStation._id })
                    .sort({ count: -1 })
                    .limit(topLimit);
                responseDataWithStationAndKeys.push(data);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (top3RadioStations_1_1 && !top3RadioStations_1_1.done && (_a = top3RadioStations_1.return)) await _a.call(top3RadioStations_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return responseDataWithStationAndKeys;
    }
    async getCount(queryDto) {
        return this.radiostationSonicKeysService.radioStationSonickeyModel.estimatedDocumentCount(Object.assign({}, queryDto.filter));
    }
    async getOwnersKeys(radioStationId, queryDto) {
        queryDto.filter['radioStation'] = radioStationId;
        return this.radiostationSonicKeysService.findAll(queryDto);
    }
};
__decorate([
    common_1.Get('/owners/:targetUser'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    swagger_1.ApiBearerAuth(),
    anyapiquerytemplate_decorator_1.AnyApiQueryTemplate(),
    swagger_1.ApiOperation({
        summary: 'Get All RadioStations Sonic Keys of particular user',
    }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, common_1.Param('targetUser')),
    __param(1, common_1.Query(new parseQueryValue_pipe_1.ParseQueryValue())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, parsedquery_dto_1.ParsedQueryDto]),
    __metadata("design:returntype", Promise)
], RadiostationSonicKeysController.prototype, "getOwnersRadioStationsSonicKeys", null);
__decorate([
    common_1.Get('/owners/:targetUser/dashboard/count'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    swagger_1.ApiBearerAuth(),
    anyapiquerytemplate_decorator_1.AnyApiQueryTemplate({
        additionalHtmlDescription: `
  <fieldset>
  <legend><h1>Example For This Endpoint:</h1></legend>
  <code><small>BASE_URL?radiostations-sonickeys/owners/5728f50d-146b-47d2-aa7b-a50bc37d641d/dashboard/count/?detectedDetails.detectedAt<2021-06-30&detectedDetails.detectedAt>2021-06-01</small></code>
 <br/>
 <h4>OR For Specific RadioStation</h4>
 <code><small>BASE_URL?radiostations-sonickeys/owners/5728f50d-146b-47d2-aa7b-a50bc37d641d/dashboard/count/?detectedDetails.detectedAt<2021-06-30&detectedDetails.detectedAt>2021-06-01&radioStation=609cd75081fe3a15732162ef</small></code>
  </fieldset>
 `,
    }),
    swagger_1.ApiOperation({
        summary: 'Get All sonickeys detected count within month or radioStation',
    }),
    openapi.ApiResponse({ status: 200, type: Number }),
    __param(0, common_1.Param('targetUser')),
    __param(1, common_1.Query(new parseQueryValue_pipe_1.ParseQueryValue())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, parsedquery_dto_1.ParsedQueryDto]),
    __metadata("design:returntype", Promise)
], RadiostationSonicKeysController.prototype, "retriveDashboardCountData", null);
__decorate([
    common_1.Get('/owners/:targetUser/radio-stations/:radioStation/dashboard/chart'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    swagger_1.ApiBearerAuth(),
    anyapiquerytemplate_decorator_1.AnyApiQueryTemplate({
        additionalHtmlDescription: `
  <fieldset>
  <legend><h1>Example For This Endpoint:</h1></legend>
  <code><small>BASE_URL?radiostations-sonickeys/owners/5728f50d-146b-47d2-aa7b-a50bc37d641d/dashboard/count/?detectedDetails.detectedAt<2021-06-30&detectedDetails.detectedAt>2021-06-01</small></code>
 <br/>
 <h4>OR For Specific RadioStation</h4>
 <code><small>BASE_URL?radiostations-sonickeys/owners/5728f50d-146b-47d2-aa7b-a50bc37d641d/dashboard/count/?detectedDetails.detectedAt<2021-06-30&detectedDetails.detectedAt>2021-06-01&radioStation=609cd75081fe3a15732162ef</small></code>
  </fieldset>
 `,
    }),
    swagger_1.ApiOperation({ summary: 'Get All chart data from particulat radioStation' }),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, common_1.Param('targetUser')),
    __param(1, common_1.Param('radioStation', toObjectId_pipe_1.ToObjectIdPipe)),
    __param(2, common_1.Query(new parseQueryValue_pipe_1.ParseQueryValue())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, parsedquery_dto_1.ParsedQueryDto]),
    __metadata("design:returntype", Promise)
], RadiostationSonicKeysController.prototype, "retriveDashboardChartData", null);
__decorate([
    common_1.Get('/owners/:targetUser/dashboard/top-stations'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    swagger_1.ApiBearerAuth(),
    anyapiquerytemplate_decorator_1.AnyApiQueryTemplate({
        additionalHtmlDescription: `
  <fieldset>
  <legend><h1>Example For This Endpoint:</h1></legend>
  <code><small>BASE_URL?radiostations-sonickeys/owners/5728f50d-146b-47d2-aa7b-a50bc37d641d/dashboard/top-stations?createdAt<2021-06-30&createdAt>2021-06-01</small></code>
  </fieldset>
 `,
    }),
    swagger_1.ApiOperation({ summary: 'Get All dashboard top stations data' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, common_1.Param('targetUser')),
    __param(1, common_1.Query(new parseQueryValue_pipe_1.ParseQueryValue())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, parsedquery_dto_1.ParsedQueryDto]),
    __metadata("design:returntype", Promise)
], RadiostationSonicKeysController.prototype, "retriveDashboardTopStationsData", null);
__decorate([
    common_1.Get('/owners/:targetUser/dashboard/top-stations-with-top-sonickey'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    swagger_1.ApiBearerAuth(),
    anyapiquerytemplate_decorator_1.AnyApiQueryTemplate({
        additionalHtmlDescription: `
  <fieldset>
  <legend><h1>Example For This Endpoint:</h1></legend>
  <code><small>BASE_URL?radiostations-sonickeys/owners/5728f50d-146b-47d2-aa7b-a50bc37d641d/dashboard/top-stations-with-top-sonickey?createdAt<2021-06-30&createdAt>2021-06-01<small></code>
  </fieldset>
 `,
    }),
    swagger_1.ApiOperation({
        summary: 'Get All dashboard top stations with top sonickeys data',
    }),
    openapi.ApiResponse({ status: 200, type: [[require("../schemas/radiostation-sonickey.schema").RadioStationSonicKey]] }),
    __param(0, common_1.Param('targetUser')),
    __param(1, common_1.Query(new parseQueryValue_pipe_1.ParseQueryValue())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, parsedquery_dto_1.ParsedQueryDto]),
    __metadata("design:returntype", Promise)
], RadiostationSonicKeysController.prototype, "retriveDashboardTopStationsWithTopSonciKeysData", null);
__decorate([
    common_1.Get('/count'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({ summary: 'Get count of all radiostation-sonickeys' }),
    openapi.ApiResponse({ status: 200, type: Number }),
    __param(0, common_1.Query(new parseQueryValue_pipe_1.ParseQueryValue())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [parsedquery_dto_1.ParsedQueryDto]),
    __metadata("design:returntype", Promise)
], RadiostationSonicKeysController.prototype, "getCount", null);
__decorate([
    common_1.Get('/radio-stations/:radioStationId'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    swagger_1.ApiBearerAuth(),
    anyapiquerytemplate_decorator_1.AnyApiQueryTemplate(),
    swagger_1.ApiOperation({ summary: 'Get All Sonic Keys of particular radioStationId' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, common_1.Param('radioStationId')),
    __param(1, common_1.Query(new parseQueryValue_pipe_1.ParseQueryValue())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, parsedquery_dto_1.ParsedQueryDto]),
    __metadata("design:returntype", Promise)
], RadiostationSonicKeysController.prototype, "getOwnersKeys", null);
RadiostationSonicKeysController = __decorate([
    swagger_1.ApiTags('RadioStation-SonicKeys Controller'),
    common_1.Controller('radiostations-sonickeys'),
    __metadata("design:paramtypes", [radiostation_service_1.RadiostationService,
        radiostation_sonickeys_service_1.RadiostationSonicKeysService])
], RadiostationSonicKeysController);
exports.RadiostationSonicKeysController = RadiostationSonicKeysController;
//# sourceMappingURL=radiostation-sonickeys.controller.js.map