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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RadioMonitorController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const radiomonitor_service_1 = require("./radiomonitor.service");
const create_radiomonitor_dto_1 = require("./dto/create-radiomonitor.dto");
const decorators_1 = require("../auth/decorators");
const validatedlicense_decorator_1 = require("../auth/decorators/validatedlicense.decorator");
const radiostation_service_1 = require("../radiostation/services/radiostation.service");
let RadioMonitorController = class RadioMonitorController {
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
        return this.radiomonitorService.subscribeBulkRadioToMonitor(createRadiomonitorsDto, owner, license);
    }
    findAll() {
        return this.radiomonitorService.findAll();
    }
    findOne(id) {
        return this.radiomonitorService.findOne(+id);
    }
    update(id, updateRadiomonitorDto) {
        return this.radiomonitorService.update(+id, updateRadiomonitorDto);
    }
    remove(id) {
        return this.radiomonitorService.remove(+id);
    }
};
__decorate([
    common_1.Post('/subscribe'),
    openapi.ApiResponse({ status: 201, type: require("./schemas/radiomonitor.schema").RadioMonitor }),
    __param(0, common_1.Body()),
    __param(1, decorators_1.User('sub')),
    __param(2, validatedlicense_decorator_1.ValidatedLicense('key')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_radiomonitor_dto_1.CreateRadioMonitorDto, String, String]),
    __metadata("design:returntype", Promise)
], RadioMonitorController.prototype, "subscribe", null);
__decorate([
    common_1.Post('/subscribe-bulk'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, common_1.Body()),
    __param(1, decorators_1.User('sub')),
    __param(2, validatedlicense_decorator_1.ValidatedLicense('key')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, String, String]),
    __metadata("design:returntype", Promise)
], RadioMonitorController.prototype, "subscribeBulk", null);
__decorate([
    common_1.Get(),
    openapi.ApiResponse({ status: 200, type: Object }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RadioMonitorController.prototype, "findAll", null);
__decorate([
    common_1.Get(':id'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RadioMonitorController.prototype, "findOne", null);
__decorate([
    common_1.Put(':id'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, common_1.Param('id')),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_a = typeof UpdateRadiomonitorDto !== "undefined" && UpdateRadiomonitorDto) === "function" ? _a : Object]),
    __metadata("design:returntype", void 0)
], RadioMonitorController.prototype, "update", null);
__decorate([
    common_1.Delete(':id'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RadioMonitorController.prototype, "remove", null);
RadioMonitorController = __decorate([
    common_1.Controller('radiomonitor'),
    __metadata("design:paramtypes", [radiomonitor_service_1.RadioMonitorService,
        radiostation_service_1.RadiostationService])
], RadioMonitorController);
exports.RadioMonitorController = RadioMonitorController;
//# sourceMappingURL=radiomonitor.controller.js.map