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
exports.RadioMonitorController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const radiomonitor_service_1 = require("../radiomonitor.service");
const radiostation_service_1 = require("../../radiostation/services/radiostation.service");
const swagger_1 = require("@nestjs/swagger");
const guards_1 = require("../../auth/guards");
const license_validation_guard_1 = require("../../licensekey/guards/license-validation.guard");
const anyapiquerytemplate_decorator_1 = require("../../../shared/decorators/anyapiquerytemplate.decorator");
const parseQueryValue_pipe_1 = require("../../../shared/pipes/parseQueryValue.pipe");
const parsedquery_dto_1 = require("../../../shared/dtos/parsedquery.dto");
let RadioMonitorController = class RadioMonitorController {
    constructor(radiomonitorService, radiostationService) {
        this.radiomonitorService = radiomonitorService;
        this.radiostationService = radiostationService;
    }
    async getSubscriberedStationsList(queryDto) {
        return this.radiostationService.findAll(queryDto);
    }
    async getSubscribedStationsCount(queryDto) {
        return this.radiostationService.getCount(queryDto);
    }
};
__decorate([
    common_1.Get('/subscribed-stations-list'),
    common_1.UseGuards(guards_1.JwtAuthGuard, license_validation_guard_1.GetSubscribedRadioMonitorListLicenseValidationGuard),
    anyapiquerytemplate_decorator_1.AnyApiQueryTemplate(),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({ summary: 'Get all subscribed radio stations' }),
    openapi.ApiResponse({ status: 200, type: require("../../radiostation/dto/mongoosepaginate-radiostation.dto").MongoosePaginateRadioStationDto }),
    __param(0, common_1.Query(new parseQueryValue_pipe_1.ParseQueryValue())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [parsedquery_dto_1.ParsedQueryDto]),
    __metadata("design:returntype", Promise)
], RadioMonitorController.prototype, "getSubscriberedStationsList", null);
__decorate([
    common_1.Get('/subscribed-stations-count'),
    common_1.UseGuards(guards_1.JwtAuthGuard, license_validation_guard_1.GetSubscribedRadioMonitorListLicenseValidationGuard),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({ summary: 'Get counts of subscribed stations.' }),
    openapi.ApiResponse({ status: 200, type: Number }),
    __param(0, common_1.Query(new parseQueryValue_pipe_1.ParseQueryValue())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [parsedquery_dto_1.ParsedQueryDto]),
    __metadata("design:returntype", Promise)
], RadioMonitorController.prototype, "getSubscribedStationsCount", null);
RadioMonitorController = __decorate([
    swagger_1.ApiTags('Radio Monitoring Controller'),
    common_1.Controller('radiomonitors'),
    __metadata("design:paramtypes", [radiomonitor_service_1.RadioMonitorService,
        radiostation_service_1.RadiostationService])
], RadioMonitorController);
exports.RadioMonitorController = RadioMonitorController;
//# sourceMappingURL=radiomonitor.controller.js.map