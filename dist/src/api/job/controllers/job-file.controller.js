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
const query_dto_1 = require("../../../shared/dtos/query.dto");
const convertIntObj_pipe_1 = require("../../../shared/pipes/convertIntObj.pipe");
let JobFileController = class JobFileController {
    constructor(jobFileService, jobService) {
        this.jobFileService = jobFileService;
        this.jobService = jobService;
    }
    findAll(queryDto) {
        return this.jobFileService.findAll(queryDto);
    }
    addKeyToDbAndUpdateJobFile(jobId, fileId, addKeyAndUpdateJobFileDto) {
        return this.jobFileService.addKeyToDbAndUpdateJobFile(jobId, fileId, addKeyAndUpdateJobFileDto);
    }
    async updateJobFile(id, updateJobFileDto) {
        const updatedJobFile = await this.jobFileService.jobFileModel.updateOne({ _id: id }, updateJobFileDto, { new: true });
        if (!updatedJobFile) {
            throw new common_1.NotFoundException();
        }
        return updatedJobFile;
    }
    async createJobFile(jobId, createJobFileDto) {
        const jobData = await this.jobService.jobModel.findById(jobId);
        if (!jobData) {
            throw new common_1.NotFoundException();
        }
        const dataToSave = Object.assign(Object.assign({}, createJobFileDto), { sonicKeyToBe: this.jobFileService.sonickeyService.generateUniqueSonicKey() });
        const newJobFile = new this.jobFileService.jobFileModel(dataToSave);
        const savedJobFile = await newJobFile.save();
        jobData.jobFiles.push(savedJobFile);
        const updatedJob = await this.jobService.jobModel.findByIdAndUpdate(jobId, { jobFiles: jobData.jobFiles }, { new: true });
        await this.jobService
            .incrementReservedDetailsInLicenceBy(jobData.license, jobData.id, 1)
            .catch(async (err) => {
            await this.jobService.jobFileModel.remove(savedJobFile.id);
            throw new common_1.UnprocessableEntityException();
        });
        return { savedJobFile, updatedJob };
    }
    async addFilesToJob(jobId, createJobFileDto) {
        const jobData = await this.jobService.jobModel.findById(jobId);
        if (!jobData) {
            throw new common_1.NotFoundException();
        }
        const newJobFiles = createJobFileDto.map(jobFile => {
            const dataToSave = Object.assign(Object.assign({}, jobFile), { sonicKeyToBe: this.jobFileService.sonickeyService.generateUniqueSonicKey() });
            const newJobFile = new this.jobFileService.jobFileModel(dataToSave);
            return newJobFile;
        });
        const savedJobFiles = await this.jobFileService.jobFileModel.insertMany(newJobFiles);
        jobData.jobFiles.push(...savedJobFiles);
        const updatedJob = await this.jobService.jobModel.findByIdAndUpdate(jobId, { jobFiles: jobData.jobFiles }, { new: true });
        await this.jobService
            .incrementReservedDetailsInLicenceBy(jobData.license, jobData.id, savedJobFiles.length)
            .catch(async (err) => {
            await this.jobService.jobFileModel.deleteMany(savedJobFiles);
            throw new common_1.UnprocessableEntityException();
        });
        return { savedJobFiles, updatedJob };
    }
    async deleteJobFile(jobId, fileId) {
        const jobData = await this.jobService.jobModel.findById(jobId);
        if (!jobData) {
            throw new common_1.NotFoundException();
        }
        const deletedJobFile = await this.jobFileService.jobFileModel.findOneAndDelete({ _id: fileId });
        if (!deletedJobFile) {
            throw new common_1.NotFoundException();
        }
        jobData.jobFiles = jobData.jobFiles.filter(file => file._id !== fileId);
        const updatedJob = await this.jobService.jobModel.findByIdAndUpdate(jobId, { jobFiles: jobData.jobFiles }, { new: true });
        await this.jobService.decrementReservedDetailsInLicenceBy(jobData.license, jobData.id, 1);
        return { deletedJobFile, updatedJob };
    }
};
__decorate([
    swagger_1.ApiOperation({ summary: 'Get All Job Files' }),
    swagger_1.ApiBearerAuth(),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    common_1.Get('/job-files'),
    openapi.ApiResponse({ status: 200, type: [require("../../../schemas/jobfile.schema").JobFile] }),
    __param(0, common_1.Query(new convertIntObj_pipe_1.ConvertIntObj(['limit', 'offset']))),
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
    common_1.Put('jobs/:jobId/job-files/addkey-updatejobfile/:fileId'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, common_1.Param('jobId')),
    __param(1, common_1.Param('fileId')),
    __param(2, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, update_job_file_dto_1.AddKeyAndUpdateJobFileDto]),
    __metadata("design:returntype", void 0)
], JobFileController.prototype, "addKeyToDbAndUpdateJobFile", null);
__decorate([
    swagger_1.ApiOperation({ summary: 'Update the single file details using fileId' }),
    swagger_1.ApiBearerAuth(),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    common_1.Put('/job-files/:id'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, common_1.Param('id')),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_job_file_dto_1.UpdateJobFileDto]),
    __metadata("design:returntype", Promise)
], JobFileController.prototype, "updateJobFile", null);
__decorate([
    swagger_1.ApiOperation({ summary: 'Create and Add new jobfile to the job' }),
    swagger_1.ApiBearerAuth(),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    common_1.Post('jobs/:jobId/job-files/'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, common_1.Param('jobId')),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_job_file_dto_1.CreateJobFileDto]),
    __metadata("design:returntype", Promise)
], JobFileController.prototype, "createJobFile", null);
__decorate([
    swagger_1.ApiOperation({ summary: 'Create and Add many new jobfiles to the job' }),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiBody({ type: [create_job_file_dto_1.CreateJobFileDto] }),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    common_1.Post('jobs/:jobId/job-files/create-bulk'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, common_1.Param('jobId')),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array]),
    __metadata("design:returntype", Promise)
], JobFileController.prototype, "addFilesToJob", null);
__decorate([
    swagger_1.ApiOperation({ summary: 'Delete the job file using fileId' }),
    swagger_1.ApiBearerAuth(),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    common_1.Delete('jobs/:jobId/job-files/:fileId'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, common_1.Param('jobId')),
    __param(1, common_1.Param('fileId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], JobFileController.prototype, "deleteJobFile", null);
JobFileController = __decorate([
    swagger_1.ApiTags('Jobs Files Controller'),
    common_1.Controller(),
    __metadata("design:paramtypes", [job_file_service_1.JobFileService,
        job_service_1.JobService])
], JobFileController);
exports.JobFileController = JobFileController;
//# sourceMappingURL=job-file.controller.js.map