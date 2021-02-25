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
let JobFileService = class JobFileService {
    constructor(jobRepository, jobService) {
        this.jobRepository = jobRepository;
        this.jobService = jobService;
    }
    async update(jobId, fileId, updateJobFileDto) {
        const job = await this.jobService.findOne(jobId);
        const elementsIndex = job.jobDetails.findIndex(element => element.fileId == fileId);
        if (!elementsIndex) {
            return new common_1.NotFoundException();
        }
        job.jobDetails[elementsIndex] = Object.assign(Object.assign({}, job.jobDetails[elementsIndex]), updateJobFileDto, { fileId: fileId });
        return this.jobRepository.update(job);
    }
};
JobFileService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [job_repository_1.JobRepository,
        job_service_1.JobService])
], JobFileService);
exports.JobFileService = JobFileService;
//# sourceMappingURL=job-file.service.js.map