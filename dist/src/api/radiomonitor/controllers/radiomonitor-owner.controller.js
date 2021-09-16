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
exports.RadioMonitorOwnerController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const radiomonitor_service_1 = require("../radiomonitor.service");
const create_radiomonitor_dto_1 = require("../dto/create-radiomonitor.dto");
const decorators_1 = require("../../auth/decorators");
const validatedlicense_decorator_1 = require("../../auth/decorators/validatedlicense.decorator");
const radiostation_service_1 = require("../../radiostation/services/radiostation.service");
const swagger_1 = require("@nestjs/swagger");
const bulk_dto_1 = require("../../../shared/dtos/bulk.dto");
const parseQueryValue_pipe_1 = require("../../../shared/pipes/parseQueryValue.pipe");
const parsedquery_dto_1 = require("../../../shared/dtos/parsedquery.dto");
const guards_1 = require("../../auth/guards");
let RadioMonitorOwnerController = class RadioMonitorOwnerController {
    constructor(radiomonitorService, radiostationService) {
        this.radiomonitorService = radiomonitorService;
        this.radiostationService = radiostationService;
    }
    async subscribe(createRadiomonitorDto, owner, license) {
        const { radio } = createRadiomonitorDto;
        await this.radiostationService.findByIdOrFail(radio);
        return this.radiomonitorService.subscribeRadioToMonitor(createRadiomonitorDto, owner, license);
    }
    async subscribeBulk(createRadiomonitorsDto, owner, license) {
        return this.radiomonitorService.subscribeRadioToMonitorBulk(createRadiomonitorsDto, owner, license);
    }
    async stopListeningStream(id) {
        await this.radiomonitorService.findByIdOrFail(id);
        return this.radiomonitorService.stopListeningStream(id);
    }
    async stopListeningStreamBulk(bulkDto) {
        const { ids } = bulkDto;
        return this.radiomonitorService.stopListeningStreamBulk(ids);
    }
    async startListeningStream(id) {
        await this.radiomonitorService.findByIdOrFail(id);
        return this.radiomonitorService.startListeningStream(id);
    }
    async startListeningStreamBulk(bulkDto) {
        const { ids } = bulkDto;
        return this.radiomonitorService.startListeningStreamBulk(ids);
    }
    async getSubscriberCount(owner, ownerId, queryDto) {
        const filter = queryDto.filter || {};
        filter['owner'] = ownerId;
        return this.radiomonitorService.radioMonitorModel
            .where(filter)
            .countDocuments();
    }
    async unsubscribe(id) {
        await this.radiomonitorService.findByIdOrFail(id);
        return this.radiomonitorService.unsubscribeById(id);
    }
    async unsubscribeBulk(bulkDto) {
        const { ids } = bulkDto;
        return this.radiomonitorService.unsubscribeBulk(ids);
    }
};
__decorate([
    common_1.Post('/owners/:ownerId/subscribe'),
    common_1.UseGuards(guards_1.JwtAuthGuard, guards_1.SubscribeRadioMonitorLicenseValidationGuard),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({ summary: 'Subscribe the radio monitoring' }),
    openapi.ApiResponse({ status: 201, type: require("../schemas/radiomonitor.schema").RadioMonitor }),
    __param(0, common_1.Body()),
    __param(1, decorators_1.User('sub')),
    __param(2, validatedlicense_decorator_1.ValidatedLicense('key')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_radiomonitor_dto_1.CreateRadioMonitorDto, String, String]),
    __metadata("design:returntype", Promise)
], RadioMonitorOwnerController.prototype, "subscribe", null);
__decorate([
    common_1.Post('/owners/:ownerId/subscribe-bulk'),
    common_1.UseGuards(guards_1.JwtAuthGuard, guards_1.SubscribeRadioMonitorLicenseValidationGuard),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({ summary: 'Subscribe the BULK radio monitoring' }),
    swagger_1.ApiBody({ type: [create_radiomonitor_dto_1.CreateRadioMonitorDto] }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, common_1.Body()),
    __param(1, decorators_1.User('sub')),
    __param(2, validatedlicense_decorator_1.ValidatedLicense('key')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, String, String]),
    __metadata("design:returntype", Promise)
], RadioMonitorOwnerController.prototype, "subscribeBulk", null);
__decorate([
    common_1.Put(':id/owners/:ownerId/stop-listening-stream'),
    common_1.UseGuards(guards_1.JwtAuthGuard),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({ summary: 'Stop listening for stream' }),
    openapi.ApiResponse({ status: 200, type: require("../schemas/radiomonitor.schema").RadioMonitor }),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RadioMonitorOwnerController.prototype, "stopListeningStream", null);
__decorate([
    common_1.Put('owners/:ownerId/stop-listening-stream-bulk'),
    common_1.UseGuards(guards_1.JwtAuthGuard),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({ summary: 'Stop listening for stream bulk' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [bulk_dto_1.BulkByIdsDto]),
    __metadata("design:returntype", Promise)
], RadioMonitorOwnerController.prototype, "stopListeningStreamBulk", null);
__decorate([
    common_1.Put(':id/owners/:ownerId/start-listening-stream'),
    common_1.UseGuards(guards_1.JwtAuthGuard),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({ summary: 'Start listening for stream' }),
    openapi.ApiResponse({ status: 200, type: require("../schemas/radiomonitor.schema").RadioMonitor }),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RadioMonitorOwnerController.prototype, "startListeningStream", null);
__decorate([
    common_1.Put('owners/:ownerId/start-listening-stream-bulk'),
    common_1.UseGuards(guards_1.JwtAuthGuard),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({ summary: 'Start listening for stream' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [bulk_dto_1.BulkByIdsDto]),
    __metadata("design:returntype", Promise)
], RadioMonitorOwnerController.prototype, "startListeningStreamBulk", null);
__decorate([
    common_1.Get('owners/:ownerId/subscriber-count'),
    common_1.UseGuards(guards_1.JwtAuthGuard),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({ summary: 'Get counts with filter eg: ?isListeningStarted=true OR ?isError=true etc..' }),
    openapi.ApiResponse({ status: 200, type: Number }),
    __param(0, decorators_1.User('sub')),
    __param(1, common_1.Param('ownerId')),
    __param(2, common_1.Query(new parseQueryValue_pipe_1.ParseQueryValue())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, parsedquery_dto_1.ParsedQueryDto]),
    __metadata("design:returntype", Promise)
], RadioMonitorOwnerController.prototype, "getSubscriberCount", null);
__decorate([
    common_1.Delete(':id/owners/:ownerId/unsubscribe'),
    common_1.UseGuards(guards_1.JwtAuthGuard),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({ summary: 'Un-subscribe the radio monitoring' }),
    openapi.ApiResponse({ status: 200, type: require("../schemas/radiomonitor.schema").RadioMonitor }),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RadioMonitorOwnerController.prototype, "unsubscribe", null);
__decorate([
    common_1.Delete('owners/:ownerId/unsubscribe-bulk'),
    common_1.UseGuards(guards_1.JwtAuthGuard),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({ summary: 'Un-subscribe the BULK radio monitoring' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [bulk_dto_1.BulkByIdsDto]),
    __metadata("design:returntype", Promise)
], RadioMonitorOwnerController.prototype, "unsubscribeBulk", null);
RadioMonitorOwnerController = __decorate([
    swagger_1.ApiTags('Radio Monitoring Controller'),
    common_1.Controller('radiomonitors'),
    __metadata("design:paramtypes", [radiomonitor_service_1.RadioMonitorService,
        radiostation_service_1.RadiostationService])
], RadioMonitorOwnerController);
exports.RadioMonitorOwnerController = RadioMonitorOwnerController;
//# sourceMappingURL=radiomonitor-owner.controller.js.map