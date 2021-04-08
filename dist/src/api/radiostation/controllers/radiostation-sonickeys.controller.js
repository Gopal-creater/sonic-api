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
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const radiostation_sonickeys_service_1 = require("../services/radiostation-sonickeys.service");
let RadiostationSonicKeysController = class RadiostationSonicKeysController {
    constructor(radiostationService, radiostationSonicKeysService) {
        this.radiostationService = radiostationService;
        this.radiostationSonicKeysService = radiostationSonicKeysService;
    }
    findAllSonicKeys(radiostationId) {
        return this.radiostationSonicKeysService.findAllSonicKeysForRadioStation(radiostationId);
    }
    async createTable() {
        return await this.radiostationSonicKeysService.radioStationSonicKeysRepository
            .ensureTableExistsAndCreate()
            .then(() => 'Created New Table');
    }
};
__decorate([
    common_1.Get('/:radiostationId/sonic-keys'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({ summary: 'Get All SonicKeys for this Radio Station' }),
    openapi.ApiResponse({ status: 200, type: [require("../../../schemas/radiostationSonickey.schema").RadioStationSonicKey] }),
    __param(0, common_1.Param('radiostationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RadiostationSonicKeysController.prototype, "findAllSonicKeys", null);
__decorate([
    common_1.Get('/new/create-r_s-aux-table'),
    swagger_1.ApiOperation({ summary: 'Create RadioStation-SonicKey Aux table in Dynamo DB' }),
    openapi.ApiResponse({ status: 200, type: String }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RadiostationSonicKeysController.prototype, "createTable", null);
RadiostationSonicKeysController = __decorate([
    swagger_1.ApiTags('Radio Station Contrller'),
    common_1.Controller('radiostations'),
    __metadata("design:paramtypes", [radiostation_service_1.RadiostationService, radiostation_sonickeys_service_1.RadiostationSonicKeysService])
], RadiostationSonicKeysController);
exports.RadiostationSonicKeysController = RadiostationSonicKeysController;
//# sourceMappingURL=radiostation-sonickeys.controller.js.map