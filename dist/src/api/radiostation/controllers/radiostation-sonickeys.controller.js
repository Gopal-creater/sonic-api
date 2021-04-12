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
exports.RadiostationSonicKeysController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const radiostation_service_1 = require("../services/radiostation.service");
const swagger_1 = require("@nestjs/swagger");
const radiostation_sonickeys_service_1 = require("../services/radiostation-sonickeys.service");
const query_dto_1 = require("../../../shared/dtos/query.dto");
const convertIntObj_pipe_1 = require("../../../shared/pipes/convertIntObj.pipe");
let RadiostationSonicKeysController = class RadiostationSonicKeysController {
    constructor(radiostationService, radiostationSonicKeysService) {
        this.radiostationService = radiostationService;
        this.radiostationSonicKeysService = radiostationSonicKeysService;
    }
    findAll(queryDto) {
        return this.radiostationSonicKeysService.findAll(queryDto);
    }
};
__decorate([
    common_1.Get('/'),
    swagger_1.ApiOperation({ summary: 'Get All radiostations-sonickeys' }),
    openapi.ApiResponse({ status: 200, type: [require("../../../schemas/radiostation-sonickey.schema").RadioStationSonicKey] }),
    __param(0, common_1.Query(new convertIntObj_pipe_1.ConvertIntObj(['limit', 'offset']))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_dto_1.QueryDto]),
    __metadata("design:returntype", void 0)
], RadiostationSonicKeysController.prototype, "findAll", null);
RadiostationSonicKeysController = __decorate([
    swagger_1.ApiTags('RadioStation-SonicKeys Controller'),
    common_1.Controller('radiostations-sonickeys'),
    __metadata("design:paramtypes", [radiostation_service_1.RadiostationService,
        radiostation_sonickeys_service_1.RadiostationSonicKeysService])
], RadiostationSonicKeysController);
exports.RadiostationSonicKeysController = RadiostationSonicKeysController;
//# sourceMappingURL=radiostation-sonickeys.controller.js.map