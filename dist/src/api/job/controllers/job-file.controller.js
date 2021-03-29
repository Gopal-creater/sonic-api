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
exports.JobFileController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const update_job_file_dto_1 = require("../dto/update-job-file.dto");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const job_file_service_1 = require("../services/job-file.service");
let JobFileController = class JobFileController {
    constructor(jobFileService) {
        this.jobFileService = jobFileService;
    }
    addKeyToDbAndUpdateJobFile(jobId, fileId, addKeyAndUpdateJobFileDto) {
        return this.jobFileService.addKeyToDbAndUpdateJobFile(jobId, fileId, addKeyAndUpdateJobFileDto);
    }
    updateJobFile(jobId, fileId, updateJobFileDto) {
        return this.jobFileService.updateJobFile(jobId, fileId, updateJobFileDto);
    }
};
__decorate([
    swagger_1.ApiOperation({ summary: 'Add new sonic key and update the file details using fileId' }),
    swagger_1.ApiBearerAuth(),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    common_1.Put('/addkey-updatefile/:fileId'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, common_1.Param('jobId')),
    __param(1, common_1.Param('fileId')),
    __param(2, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, update_job_file_dto_1.AddKeyAndUpdateJobFileDto]),
    __metadata("design:returntype", void 0)
], JobFileController.prototype, "addKeyToDbAndUpdateJobFile", null);
__decorate([
    swagger_1.ApiOperation({ summary: 'Update the file details using fileId' }),
    swagger_1.ApiBearerAuth(),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    common_1.Put('/updatefile/:fileId'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, common_1.Param('jobId')),
    __param(1, common_1.Param('fileId')),
    __param(2, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, update_job_file_dto_1.UpdateJobFileDto]),
    __metadata("design:returntype", void 0)
], JobFileController.prototype, "updateJobFile", null);
JobFileController = __decorate([
    swagger_1.ApiTags('Jobs Files Controller'),
    common_1.Controller('jobs/:jobId'),
    __metadata("design:paramtypes", [job_file_service_1.JobFileService])
], JobFileController);
exports.JobFileController = JobFileController;
//# sourceMappingURL=job-file.controller.js.map