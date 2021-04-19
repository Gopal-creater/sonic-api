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
exports.MongotestController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const mongotest_service_1 = require("./mongotest.service");
const create_mongotest_dto_1 = require("./dto/create-mongotest.dto");
const update_mongotest_dto_1 = require("./dto/update-mongotest.dto");
let MongotestController = class MongotestController {
    constructor(mongotestService) {
        this.mongotestService = mongotestService;
    }
    create(createMongotestDto) {
        return this.mongotestService.create(createMongotestDto);
    }
    findAll() {
        return this.mongotestService.findAll();
    }
    findOne(id) {
        return this.mongotestService.findOne(+id);
    }
    update(id, updateMongotestDto) {
        return this.mongotestService.update(+id, updateMongotestDto);
    }
    remove(id) {
        return this.mongotestService.remove(+id);
    }
};
__decorate([
    common_1.Post(),
    openapi.ApiResponse({ status: 201, type: String }),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_mongotest_dto_1.CreateMongotestDto]),
    __metadata("design:returntype", void 0)
], MongotestController.prototype, "create", null);
__decorate([
    common_1.Get(),
    openapi.ApiResponse({ status: 200, type: String }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MongotestController.prototype, "findAll", null);
__decorate([
    common_1.Get(':id'),
    openapi.ApiResponse({ status: 200, type: String }),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MongotestController.prototype, "findOne", null);
__decorate([
    common_1.Put(':id'),
    openapi.ApiResponse({ status: 200, type: String }),
    __param(0, common_1.Param('id')), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_mongotest_dto_1.UpdateMongotestDto]),
    __metadata("design:returntype", void 0)
], MongotestController.prototype, "update", null);
__decorate([
    common_1.Delete(':id'),
    openapi.ApiResponse({ status: 200, type: String }),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MongotestController.prototype, "remove", null);
MongotestController = __decorate([
    common_1.Controller('mongotest'),
    __metadata("design:paramtypes", [mongotest_service_1.MongotestService])
], MongotestController);
exports.MongotestController = MongotestController;
//# sourceMappingURL=mongotest.controller.js.map