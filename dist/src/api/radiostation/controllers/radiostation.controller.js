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
exports.RadiostationController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const radiostation_service_1 = require("../services/radiostation.service");
const create_radiostation_dto_1 = require("../dto/create-radiostation.dto");
const update_radiostation_dto_1 = require("../dto/update-radiostation.dto");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const bulk_radiostation_dto_1 = require("../dto/bulk-radiostation.dto");
const parseQueryValue_pipe_1 = require("../../../shared/pipes/parseQueryValue.pipe");
const parsedquery_dto_1 = require("../../../shared/dtos/parsedquery.dto");
const anyapiquerytemplate_decorator_1 = require("../../../shared/decorators/anyapiquerytemplate.decorator");
let RadiostationController = class RadiostationController {
    constructor(radiostationService) {
        this.radiostationService = radiostationService;
    }
    create(createRadiostationDto) {
        return this.radiostationService.create(createRadiostationDto);
    }
    findAll(queryDto) {
        return this.radiostationService.findAll(queryDto);
    }
    async getOwnersRadioStations(ownerId, queryDto) {
        queryDto.filter["owner"] = ownerId;
        return this.radiostationService.findAll(queryDto);
    }
    async getCount(query) {
        return this.radiostationService.radioStationModel.estimatedDocumentCount(Object.assign({}, query));
    }
    async findOne(id) {
        const radioStation = await this.radiostationService.radioStationModel.findById(id);
        if (!radioStation) {
            throw new common_1.NotFoundException();
        }
        return radioStation;
    }
    stopListeningStream(id) {
        return this.radiostationService.stopListeningStream(id).catch(err => {
            if (err.status == 404) {
                throw new common_1.NotFoundException();
            }
            throw err;
        });
    }
    startListeningStream(id) {
        return this.radiostationService.startListeningStream(id).catch(err => {
            if (err.status == 404) {
                throw new common_1.NotFoundException();
            }
            throw err;
        });
    }
    bulkStartListeningStream(bulkDto) {
        return this.radiostationService.bulkStartListeningStream(bulkDto.ids);
    }
    bulkStopListeningStream(bulkDto) {
        return this.radiostationService.bulkStopListeningStream(bulkDto.ids);
    }
    async update(id, updateRadiostationDto) {
        const updatedRadioStation = await this.radiostationService.radioStationModel.findOneAndUpdate({ _id: id }, updateRadiostationDto, { new: true });
        if (!updatedRadioStation) {
            throw new common_1.NotFoundException();
        }
        return updatedRadioStation;
    }
    removeBulk(bulkDto) {
        return this.radiostationService.bulkRemove(bulkDto.ids);
    }
    remove(id) {
        return this.radiostationService.removeById(id).catch(err => {
            if (err.status == 404) {
                throw new common_1.NotFoundException();
            }
            throw err;
        });
    }
};
__decorate([
    common_1.Post(),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({ summary: 'Create Radio Station' }),
    openapi.ApiResponse({ status: 201, type: require("../schemas/radiostation.schema").RadioStation }),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_radiostation_dto_1.CreateRadiostationDto]),
    __metadata("design:returntype", void 0)
], RadiostationController.prototype, "create", null);
__decorate([
    common_1.Get(),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    swagger_1.ApiBearerAuth(),
    anyapiquerytemplate_decorator_1.AnyApiQueryTemplate(),
    swagger_1.ApiOperation({ summary: 'Get All Radio Stations' }),
    openapi.ApiResponse({ status: 200, type: require("../dto/mongoosepaginate-radiostation.dto").MongoosePaginateRadioStationDto }),
    __param(0, common_1.Query(new parseQueryValue_pipe_1.ParseQueryValue())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [parsedquery_dto_1.ParsedQueryDto]),
    __metadata("design:returntype", void 0)
], RadiostationController.prototype, "findAll", null);
__decorate([
    common_1.Get('/owners/:ownerId'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    swagger_1.ApiBearerAuth(),
    anyapiquerytemplate_decorator_1.AnyApiQueryTemplate(),
    swagger_1.ApiOperation({ summary: 'Get All Radio Stations of particular user' }),
    openapi.ApiResponse({ status: 200, type: require("../dto/mongoosepaginate-radiostation.dto").MongoosePaginateRadioStationDto }),
    __param(0, common_1.Param('ownerId')), __param(1, common_1.Query(new parseQueryValue_pipe_1.ParseQueryValue())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, parsedquery_dto_1.ParsedQueryDto]),
    __metadata("design:returntype", Promise)
], RadiostationController.prototype, "getOwnersRadioStations", null);
__decorate([
    common_1.Get('/count'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({ summary: 'Get count of all radiostations' }),
    openapi.ApiResponse({ status: 200, type: Number }),
    __param(0, common_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RadiostationController.prototype, "getCount", null);
__decorate([
    common_1.Get(':id'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({ summary: 'Get Single Radio Station' }),
    openapi.ApiResponse({ status: 200, type: require("../schemas/radiostation.schema").RadioStation }),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RadiostationController.prototype, "findOne", null);
__decorate([
    common_1.Put(':id/stop-listening-stream'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({ summary: 'stop listening stream' }),
    openapi.ApiResponse({ status: 200, type: require("../schemas/radiostation.schema").RadioStation }),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RadiostationController.prototype, "stopListeningStream", null);
__decorate([
    common_1.Put(':id/start-listening-stream'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({ summary: 'start listening stream' }),
    openapi.ApiResponse({ status: 200, type: require("../schemas/radiostation.schema").RadioStation }),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RadiostationController.prototype, "startListeningStream", null);
__decorate([
    common_1.Put('start-listening-stream/bulk'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({ summary: 'stop listening stream' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [bulk_radiostation_dto_1.BulkRadiostationDto]),
    __metadata("design:returntype", void 0)
], RadiostationController.prototype, "bulkStartListeningStream", null);
__decorate([
    common_1.Put('stop-listening-stream/bulk'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({ summary: 'stop listening stream' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [bulk_radiostation_dto_1.BulkRadiostationDto]),
    __metadata("design:returntype", void 0)
], RadiostationController.prototype, "bulkStopListeningStream", null);
__decorate([
    common_1.Put(':id'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({ summary: 'Update Single Radio Station' }),
    openapi.ApiResponse({ status: 200, type: require("../schemas/radiostation.schema").RadioStation }),
    __param(0, common_1.Param('id')),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_radiostation_dto_1.UpdateRadiostationDto]),
    __metadata("design:returntype", Promise)
], RadiostationController.prototype, "update", null);
__decorate([
    common_1.Delete('delete/bulk'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({ summary: 'Delete Radio Station in bulk' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [bulk_radiostation_dto_1.BulkRadiostationDto]),
    __metadata("design:returntype", void 0)
], RadiostationController.prototype, "removeBulk", null);
__decorate([
    common_1.Delete(':id'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({ summary: 'Delete Radio Station' }),
    openapi.ApiResponse({ status: 200, type: require("../schemas/radiostation.schema").RadioStation }),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RadiostationController.prototype, "remove", null);
RadiostationController = __decorate([
    swagger_1.ApiTags('Radio Station Controller'),
    common_1.Controller('radiostations'),
    __metadata("design:paramtypes", [radiostation_service_1.RadiostationService])
], RadiostationController);
exports.RadiostationController = RadiostationController;
//# sourceMappingURL=radiostation.controller.js.map