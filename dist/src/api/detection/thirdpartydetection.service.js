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
exports.ThirdPartyDetectionService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const detection_schema_1 = require("./schemas/detection.schema");
const mongoose_2 = require("mongoose");
const Enums_1 = require("../../constants/Enums");
const user_service_1 = require("../user/services/user.service");
const file_handler_service_1 = require("../../shared/services/file-handler.service");
let ThirdPartyDetectionService = class ThirdPartyDetectionService {
    constructor(detectionModel, userService, fileHandlerService) {
        this.detectionModel = detectionModel;
        this.userService = userService;
        this.fileHandlerService = fileHandlerService;
    }
    async createDetectionFromLamda(sonickey, radiostation) {
    }
};
ThirdPartyDetectionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(detection_schema_1.Detection.name)),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => user_service_1.UserService))),
    __metadata("design:paramtypes", [mongoose_2.Model,
        user_service_1.UserService,
        file_handler_service_1.FileHandlerService])
], ThirdPartyDetectionService);
exports.ThirdPartyDetectionService = ThirdPartyDetectionService;
//# sourceMappingURL=thirdpartydetection.service.js.map