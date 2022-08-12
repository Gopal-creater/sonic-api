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
const subscribe_radiomonitor_dto_1 = require("../dto/subscribe-radiomonitor.dto");
const user_db_schema_1 = require("../../user/schemas/user.db.schema");
const user_decorator_1 = require("../../auth/decorators/user.decorator");
const apikey_decorator_1 = require("../../api-key/decorators/apikey.decorator");
const validatedlicense_decorator_1 = require("../../licensekey/decorators/validatedlicense.decorator");
const utils_1 = require("../../../shared/utils");
const unsubscribe_radiomonitor_dto_1 = require("../dto/unsubscribe-radiomonitor.dto");
const roles_decorator_1 = require("../../auth/decorators/roles.decorator");
const role_based_guard_1 = require("../../auth/guards/role-based.guard");
const license_validation_guard_2 = require("../../licensekey/guards/license-validation.guard");
let RadioMonitorController = class RadioMonitorController {
    constructor(radiomonitorService, radiostationService) {
        this.radiomonitorService = radiomonitorService;
        this.radiostationService = radiostationService;
    }
    async getSubscriberedStationsList(queryDto) {
        return this.radiomonitorService.findAll(queryDto);
    }
    async getCount(queryDto) {
        return this.radiomonitorService.getCount(queryDto);
    }
    async getEstimateCount() {
        return this.radiomonitorService.getEstimateCount();
    }
    async findById(id) {
        const radioMonitor = await this.radiomonitorService.findById(id);
        if (!radioMonitor) {
            return new common_1.NotFoundException();
        }
        return radioMonitor;
    }
    async subscribeRadioStation(subscribeRadioMonitorDtos, loggedInUser, apiKey, licenseId) {
        const { resourceOwnerObj, } = (0, utils_1.identifyDestinationFolderAndResourceOwnerFromUser)(loggedInUser);
        const promises = subscribeRadioMonitorDtos.map(async (subscribeRadioMonitorDto) => {
            const radioMonitorDoc = Object.assign({ radio: subscribeRadioMonitorDto.radio, license: licenseId, apiKey: apiKey }, resourceOwnerObj);
            return this.radiomonitorService
                .subscribeRadioToMonitor(subscribeRadioMonitorDto.radio, licenseId, radioMonitorDoc)
                .catch(err => ({
                promiseError: err,
                data: subscribeRadioMonitorDto.radio,
            }));
        });
        return Promise.all(promises).then(values => {
            const failedData = values.filter(item => item['promiseError']);
            const passedData = values.filter(item => !item['promiseError']);
            return {
                passedData: passedData,
                failedData: failedData,
            };
        });
    }
    async unSubscribeRadioStation(unSubscribeRadioMonitorDtos) {
        const promises = unSubscribeRadioMonitorDtos.map(async (unSubscribeRadioMonitorDto) => {
            return this.radiomonitorService
                .unsubscribeMonitor(unSubscribeRadioMonitorDto.radioMonitor)
                .catch(err => ({
                promiseError: err,
                data: unSubscribeRadioMonitorDto.radioMonitor,
            }));
        });
        return Promise.all(promises).then(values => {
            const failedData = values.filter(item => item['promiseError']);
            const passedData = values.filter(item => !item['promiseError']);
            return {
                passedData: passedData,
                failedData: failedData,
            };
        });
    }
};
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.RolesAllowed)(),
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard, role_based_guard_1.RoleBasedGuard),
    (0, anyapiquerytemplate_decorator_1.AnyApiQueryTemplate)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all subscribed radio stations' }),
    openapi.ApiResponse({ status: 200, type: require("../dto/mongoosepaginate-radiomonitordto").MongoosePaginateRadioMonitorDto }),
    __param(0, (0, common_1.Query)(new parseQueryValue_pipe_1.ParseQueryValue())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [parsedquery_dto_1.ParsedQueryDto]),
    __metadata("design:returntype", Promise)
], RadioMonitorController.prototype, "getSubscriberedStationsList", null);
__decorate([
    (0, common_1.Get)('/count'),
    (0, roles_decorator_1.RolesAllowed)(),
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard, role_based_guard_1.RoleBasedGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get count of all radiomonitors-subscription  also accept filter as query params',
    }),
    openapi.ApiResponse({ status: 200, type: Number }),
    __param(0, (0, common_1.Query)(new parseQueryValue_pipe_1.ParseQueryValue())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [parsedquery_dto_1.ParsedQueryDto]),
    __metadata("design:returntype", Promise)
], RadioMonitorController.prototype, "getCount", null);
__decorate([
    (0, common_1.Get)('/estimate-count'),
    (0, roles_decorator_1.RolesAllowed)(),
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard, role_based_guard_1.RoleBasedGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all count of all radiomonitors-subscription',
    }),
    openapi.ApiResponse({ status: 200, type: Number }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RadioMonitorController.prototype, "getEstimateCount", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Get radio subscription by id',
    }),
    (0, roles_decorator_1.RolesAllowed)(),
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard, role_based_guard_1.RoleBasedGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Get)(':id'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RadioMonitorController.prototype, "findById", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Subscribe radio stations',
    }),
    (0, roles_decorator_1.RolesAllowed)(),
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard, role_based_guard_1.RoleBasedGuard, license_validation_guard_2.SubscribeRadioMonitorLicenseValidationGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiBody)({ type: subscribe_radiomonitor_dto_1.SubscribeRadioMonitorDto, isArray: true }),
    (0, common_1.Post)('/subscribe-radios'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, user_decorator_1.User)()),
    __param(2, (0, apikey_decorator_1.ApiKey)('_id')),
    __param(3, (0, validatedlicense_decorator_1.ValidatedLicense)('key')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, user_db_schema_1.UserDB, String, String]),
    __metadata("design:returntype", Promise)
], RadioMonitorController.prototype, "subscribeRadioStation", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Unsubscribe radio stations',
    }),
    (0, roles_decorator_1.RolesAllowed)(),
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard, role_based_guard_1.RoleBasedGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiBody)({ type: unsubscribe_radiomonitor_dto_1.UnSubscribeRadioMonitorDto, isArray: true }),
    (0, common_1.Post)('/unsubscribe-radios'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], RadioMonitorController.prototype, "unSubscribeRadioStation", null);
RadioMonitorController = __decorate([
    (0, swagger_1.ApiTags)('Radio Monitoring & Subscription Controller'),
    (0, common_1.Controller)('radiomonitors-subscription'),
    __metadata("design:paramtypes", [radiomonitor_service_1.RadioMonitorService,
        radiostation_service_1.RadiostationService])
], RadioMonitorController);
exports.RadioMonitorController = RadioMonitorController;
//# sourceMappingURL=radiomonitor.controller.js.map