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
const parseQueryValue_pipe_1 = require("../../../shared/pipes/parseQueryValue.pipe");
const parsedquery_dto_1 = require("../../../shared/dtos/parsedquery.dto");
const anyapiquerytemplate_decorator_1 = require("../../../shared/decorators/anyapiquerytemplate.decorator");
const licensekey_service_1 = require("../../licensekey/services/licensekey.service");
let JobFileController = class JobFileController {
    constructor(jobFileService, jobService, licensekeyService) {
        this.jobFileService = jobFileService;
        this.jobService = jobService;
        this.licensekeyService = licensekeyService;
    }
    findAll(queryDto) {
        return this.jobFileService.findAll(queryDto);
    }
    async getCount(queryDto) {
        const filter = queryDto.filter || {};
        return this.jobFileService.jobFileModel.where(filter).countDocuments();
    }
    addKeyToDbAndUpdateJobFile(jobId, fileId, addKeyAndUpdateJobFileDto) {
        return this.jobFileService.addKeyToDbAndUpdateJobFile(jobId, fileId, addKeyAndUpdateJobFileDto);
    }
    async updateJobFile(id, updateJobFileDto) {
        const updatedJobFile = await this.jobFileService.updateJobFile(id, updateJobFileDto);
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
        await this.licensekeyService
            .incrementReservedDetailsInLicenceBy(jobData.license, jobData.id, 1)
            .catch(async (err) => {
            await this.jobService.jobFileModel.findByIdAndRemove(savedJobFile.id);
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
        await this.licensekeyService
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
        await this.licensekeyService.decrementReservedDetailsInLicenceBy(jobData.license, jobData.id, 1);
        return { deletedJobFile, updatedJob };
    }
};
__decorate([
    swagger_1.ApiOperation({ summary: 'Get All Job Files' }),
    swagger_1.ApiBearerAuth(),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    anyapiquerytemplate_decorator_1.AnyApiQueryTemplate(),
    common_1.Get('/job-files'),
    openapi.ApiResponse({ status: 200, type: require("../dto/mongoosepaginate-jobfile.dto").MongoosePaginateJobFileDto }),
    __param(0, common_1.Query(new parseQueryValue_pipe_1.ParseQueryValue())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [parsedquery_dto_1.ParsedQueryDto]),
    __metadata("design:returntype", void 0)
], JobFileController.prototype, "findAll", null);
__decorate([
    common_1.Get('/count'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({
        summary: 'Get count of all job-file also accept filter as query params',
    }),
    openapi.ApiResponse({ status: 200, type: Number }),
    __param(0, common_1.Query(new parseQueryValue_pipe_1.ParseQueryValue())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [parsedquery_dto_1.ParsedQueryDto]),
    __metadata("design:returntype", Promise)
], JobFileController.prototype, "getCount", null);
__decorate([
    swagger_1.ApiOperation({
        summary: 'Add new sonic key and update the file details using fileId upon successfull encode locally',
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
    common_1.Post('jobs/:jobId/job-files'),
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
        job_service_1.JobService,
        licensekey_service_1.LicensekeyService])
], JobFileController);
exports.JobFileController = JobFileController;
//# sourceMappingURL=job-file.controller.js.map