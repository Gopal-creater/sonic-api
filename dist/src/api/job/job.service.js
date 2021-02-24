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
exports.JobService = void 0;
const common_1 = require("@nestjs/common");
const job_repository_1 = require("../../repositories/job.repository");
let JobService = class JobService {
    constructor(jobRepository) {
        this.jobRepository = jobRepository;
    }
    create(createJobDto) {
        return 'This action adds a new job';
    }
    findAll() {
        return `This action returns all job`;
    }
    findOne(id) {
        return `This action returns a #${id} job`;
    }
    update(id, updateJobDto) {
        return `This action updates a #${id} job`;
    }
    updateJobDetailByFilePath(id, filePath, updateJobDto) {
        return `This action updates a #${id} job`;
    }
    remove(id) {
        return `This action removes a #${id} job`;
    }
    findByOwner(owner) {
        return `This action a #${owner} owner`;
    }
};
JobService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [job_repository_1.JobRepository])
], JobService);
exports.JobService = JobService;
//# sourceMappingURL=job.service.js.map