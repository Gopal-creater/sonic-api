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
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobFileService = void 0;
const common_1 = require("@nestjs/common");
const job_repository_1 = require("../../../repositories/job.repository");
const job_service_1 = require("./job.service");
const sonickey_service_1 = require("../../sonickey/sonickey.service");
const uuid_1 = require("uuid");
const keygen_service_1 = require("../../../shared/modules/keygen/keygen.service");
let JobFileService = class JobFileService {
    constructor(jobRepository, jobService, keygenService, sonickeyService) {
        this.jobRepository = jobRepository;
        this.jobService = jobService;
        this.keygenService = keygenService;
        this.sonickeyService = sonickeyService;
    }
    async updateJobFile(jobId, fileId, updateJobFileDto) {
        const job = await this.jobService.findOne(jobId);
        if (!job) {
            throw new common_1.NotFoundException();
        }
        const elementsIndex = job.jobDetails.findIndex(element => element.fileId == fileId);
        if (elementsIndex < 0) {
            throw new common_1.NotFoundException();
        }
        const updatedOldFile = Object.assign(Object.assign({}, job.jobDetails[elementsIndex]), updateJobFileDto.fileDetail, { fileId: fileId });
        job.jobDetails[elementsIndex] = updatedOldFile;
        const updatedJob = await this.jobRepository.update(job);
        return {
            fileDetail: updatedOldFile,
            updatedJob: updatedJob,
        };
    }
    async addKeyToDbAndUpdateJobFile(jobId, fileId, addKeyAndUpdateJobFileDto) {
        const job = await this.jobService.findOne(jobId);
        if (!job) {
            throw new common_1.NotFoundException();
        }
        const elementsIndex = job.jobDetails.findIndex(element => element.fileId == fileId);
        if (elementsIndex < 0) {
            throw new common_1.NotFoundException();
        }
        var createdSonicKey = await this.sonickeyService.findBySonicKey(addKeyAndUpdateJobFileDto.sonicKeyDetail.sonicKey);
        if (!createdSonicKey) {
            createdSonicKey = (await this.sonickeyService.createFromJob(addKeyAndUpdateJobFileDto.sonicKeyDetail));
        }
        const updatedOldFile = Object.assign(Object.assign({}, job.jobDetails[elementsIndex]), addKeyAndUpdateJobFileDto.fileDetail, { fileId: fileId });
        job.jobDetails[elementsIndex] = updatedOldFile;
        const updatedJob = await this.jobRepository.update(job);
        return {
            createdSonicKey: createdSonicKey,
            fileDetail: updatedOldFile,
            updatedJob: updatedJob,
        };
    }
    async addFilesToJob(jobId, addFilesDto) {
        const job = await this.jobService.findOne(jobId);
        if (!job) {
            throw new common_1.NotFoundException();
        }
        addFilesDto.jobFiles = addFilesDto.jobFiles.map(job => {
            job['fileId'] = uuid_1.v4();
            job['isComplete'] = false;
            job['sonicKey'] = this.sonickeyService.generateUniqueSonicKey();
            return job;
        });
        job.jobDetails = [...job.jobDetails, ...addFilesDto.jobFiles];
        await this.jobService.incrementReservedDetailsInLicenceBy(job.licenseId, job.id, addFilesDto.jobFiles.length);
        const updatedJob = await this.jobRepository.update(job);
        return updatedJob;
    }
    async deleteFileFromJob(jobId, fileId) {
        var job = await this.jobService.findOne(jobId);
        if (!job) {
            throw new common_1.NotFoundException();
        }
        job.jobDetails = job.jobDetails.filter(file => file.fileId !== fileId);
        await this.jobService.decrementReservedDetailsInLicenceBy(job.licenseId, job.id, 1);
        const updatedJob = await this.jobRepository.update(job);
        return updatedJob;
    }
};
JobFileService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [job_repository_1.JobRepository,
        job_service_1.JobService,
        keygen_service_1.KeygenService,
        sonickey_service_1.SonickeyService])
], JobFileService);
exports.JobFileService = JobFileService;
//# sourceMappingURL=job-file.service.js.map