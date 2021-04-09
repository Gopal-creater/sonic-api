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
const job_service_1 = require("../services/job.service");
const create_job_file_dto_1 = require("../dto/create-job-file.dto");
const jobfile_schema_1 = require("../../../schemas/jobfile.schema");
const query_dto_1 = require("../../../shared/dtos/query.dto");
let JobFileController = class JobFileController {
    constructor(jobFileService, jobService) {
        this.jobFileService = jobFileService;
        this.jobService = jobService;
    }
    findAll(queryDto) {
        return this.jobFileService.findAll(queryDto);
    }
    addKeyToDbAndUpdateJobFile(fileId, addKeyAndUpdateJobFileDto) {
        return this.jobFileService.addKeyToDbAndUpdateJobFile(fileId, addKeyAndUpdateJobFileDto);
    }
    async updateJobFile(id, updateJobFileDto) {
        const updatedJobFile = await this.jobFileService.jobFileModel.updateOne({ id: id }, updateJobFileDto);
        if (!updatedJobFile) {
            throw new common_1.NotFoundException();
        }
        return updatedJobFile;
    }
    async createJobFile(createJobFileDto) {
        const dataToSave = Object.assign(new jobfile_schema_1.JobFile(), createJobFileDto, {
            sonicKey: this.jobFileService.sonickeyService.generateUniqueSonicKey(),
        });
        const newJob = new this.jobFileService.jobFileModel(dataToSave);
        return newJob.save();
    }
    async addFilesToJob(createJobFileDto) {
        const newJobFiles = createJobFileDto.map(jobFile => {
            const dataToSave = Object.assign(new jobfile_schema_1.JobFile(), jobFile, {
                sonicKey: this.jobFileService.sonickeyService.generateUniqueSonicKey(),
            });
            const newJob = new this.jobFileService.jobFileModel(dataToSave);
            return newJob;
        });
        return this.jobFileService.jobFileModel.insertMany(newJobFiles);
    }
    async deleteJobFile(id) {
        const deletedJobFile = await this.jobFileService.jobFileModel.findOneAndDelete({ id: id });
        if (!deletedJobFile) {
            throw new common_1.NotFoundException();
        }
        return deletedJobFile;
    }
};
__decorate([
    swagger_1.ApiOperation({ summary: 'Get All Job Files' }),
    swagger_1.ApiBearerAuth(),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    common_1.Get(),
    openapi.ApiResponse({ status: 200, type: [require("../../../schemas/jobfile.schema").JobFile] }),
    __param(0, common_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_dto_1.QueryDto]),
    __metadata("design:returntype", void 0)
], JobFileController.prototype, "findAll", null);
__decorate([
    swagger_1.ApiOperation({
        summary: 'Add new sonic key and update the file details using fileId',
    }),
    swagger_1.ApiBearerAuth(),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    common_1.Put('/addkey-updatejobfile/:fileId'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, common_1.Param('fileId')),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_job_file_dto_1.AddKeyAndUpdateJobFileDto]),
    __metadata("design:returntype", void 0)
], JobFileController.prototype, "addKeyToDbAndUpdateJobFile", null);
__decorate([
    swagger_1.ApiOperation({ summary: 'Update the single file details using fileId' }),
    swagger_1.ApiBearerAuth(),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    common_1.Put('/:id'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, common_1.Param('id')),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_job_file_dto_1.UpdateJobFileDto]),
    __metadata("design:returntype", Promise)
], JobFileController.prototype, "updateJobFile", null);
__decorate([
    swagger_1.ApiOperation({ summary: 'Create job file' }),
    swagger_1.ApiBearerAuth(),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    common_1.Post(),
    openapi.ApiResponse({ status: 201, type: require("../../../schemas/jobfile.schema").JobFile }),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_job_file_dto_1.CreateJobFileDto]),
    __metadata("design:returntype", Promise)
], JobFileController.prototype, "createJobFile", null);
__decorate([
    swagger_1.ApiOperation({ summary: 'Create many job file' }),
    swagger_1.ApiBearerAuth(),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    common_1.Post('/create-bulk'),
    openapi.ApiResponse({ status: 201, type: [require("../../../schemas/jobfile.schema").JobFile] }),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], JobFileController.prototype, "addFilesToJob", null);
__decorate([
    swagger_1.ApiOperation({ summary: 'Delete the file details using fileId' }),
    swagger_1.ApiBearerAuth(),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    common_1.Delete('/:id'),
    openapi.ApiResponse({ status: 200, type: require("../../../schemas/jobfile.schema").JobFile }),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], JobFileController.prototype, "deleteJobFile", null);
JobFileController = __decorate([
    swagger_1.ApiTags('Jobs Files Controller'),
    common_1.Controller('job-files'),
    __metadata("design:paramtypes", [job_file_service_1.JobFileService,
        job_service_1.JobService])
], JobFileController);
exports.JobFileController = JobFileController;
//# sourceMappingURL=job-file.controller.js.map