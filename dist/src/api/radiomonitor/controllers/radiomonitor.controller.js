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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RadioMonitorController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const radiomonitor_service_1 = require("../radiomonitor.service");
const radiostation_service_1 = require("../../radiostation/services/radiostation.service");
const swagger_1 = require("@nestjs/swagger");
let RadioMonitorController = class RadioMonitorController {
    constructor(radiomonitorService, radiostationService) {
        this.radiomonitorService = radiomonitorService;
        this.radiostationService = radiostationService;
    }
};
RadioMonitorController = __decorate([
    swagger_1.ApiTags('Radio Monitoring Controller'),
    common_1.Controller('radiomonitors'),
    __metadata("design:paramtypes", [radiomonitor_service_1.RadioMonitorService,
        radiostation_service_1.RadiostationService])
], RadioMonitorController);
exports.RadioMonitorController = RadioMonitorController;
//# sourceMappingURL=radiomonitor.controller.js.map