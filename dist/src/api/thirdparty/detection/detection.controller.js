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
exports.DetectionController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const detection_service_1 = require("./detection.service");
const create_detection_dto_1 = require("./dto/create-detection.dto");
const update_detection_dto_1 = require("./dto/update-detection.dto");
let DetectionController = class DetectionController {
    constructor(detectionService) {
        this.detectionService = detectionService;
    }
    create(createDetectionDto) {
        return this.detectionService.create(createDetectionDto);
    }
    findAll() {
        return this.detectionService.findAll();
    }
    findOne(id) {
        return this.detectionService.findOne(id);
    }
    update(id, updateDetectionDto) {
        return this.detectionService.update(id, updateDetectionDto);
    }
    remove(id) {
        return this.detectionService.remove(id);
    }
};
__decorate([
    common_1.Post(),
    openapi.ApiResponse({ status: 201, type: String }),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_detection_dto_1.CreateDetectionDto]),
    __metadata("design:returntype", void 0)
], DetectionController.prototype, "create", null);
__decorate([
    common_1.Get(),
    openapi.ApiResponse({ status: 200, type: String }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DetectionController.prototype, "findAll", null);
__decorate([
    common_1.Get(':id'),
    openapi.ApiResponse({ status: 200, type: String }),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DetectionController.prototype, "findOne", null);
__decorate([
    common_1.Put(':id'),
    openapi.ApiResponse({ status: 200, type: String }),
    __param(0, common_1.Param('id')), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_detection_dto_1.UpdateDetectionDto]),
    __metadata("design:returntype", void 0)
], DetectionController.prototype, "update", null);
__decorate([
    common_1.Delete(':id'),
    openapi.ApiResponse({ status: 200, type: String }),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DetectionController.prototype, "remove", null);
DetectionController = __decorate([
    common_1.Controller('detection'),
    __metadata("design:paramtypes", [detection_service_1.DetectionService])
], DetectionController);
exports.DetectionController = DetectionController;
//# sourceMappingURL=detection.controller.js.map