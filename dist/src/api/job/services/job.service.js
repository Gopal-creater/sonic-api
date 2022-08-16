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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobService = void 0;
const common_1 = require("@nestjs/common");
const job_schema_1 = require("../schemas/job.schema");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const jobfile_schema_1 = require("../schemas/jobfile.schema");
const licensekey_service_1 = require("../../licensekey/services/licensekey.service");
let JobService = class JobService {
    constructor(jobModel, jobFileModel, licensekeyService) {
        this.jobModel = jobModel;
        this.jobFileModel = jobFileModel;
        this.licensekeyService = licensekeyService;
    }
    async create(createJobDto) {
        const { jobFiles } = createJobDto, job = __rest(createJobDto, ["jobFiles"]);
        const newJob = new this.jobModel(job);
        var createdJob = await newJob.save();
        const newJobFiles = jobFiles.map(jobFile => {
            const newJobFile = new this.jobFileModel(Object.assign(Object.assign({}, jobFile), { job: createdJob }));
            return newJobFile;
        });
        const savedJobFiles = await this.jobFileModel.insertMany(newJobFiles);
        createdJob.jobFiles.push(...savedJobFiles);
        const updatedCreatedJob = await this.jobModel.findByIdAndUpdate(createdJob._id, { jobFiles: createdJob.jobFiles }, { new: true });
        await this.licensekeyService.addReservedDetailsInLicence(createJobDto.license, [
            { jobId: createdJob.id, count: updatedCreatedJob.jobFiles.length },
        ]).catch(async (err) => {
            await this.jobModel.remove({ _id: createdJob._id });
            await this.jobFileModel.remove({ job: createdJob._id });
            throw new common_1.BadRequestException('Error adding reserved licence count');
        });
        return updatedCreatedJob;
    }
    async findAll(queryDto) {
        const { limit, skip, sort, page, filter, select, populate } = queryDto;
        var paginateOptions = {};
        paginateOptions['sort'] = sort;
        paginateOptions['select'] = select;
        paginateOptions['populate'] = populate;
        paginateOptions['offset'] = skip;
        paginateOptions['page'] = page;
        paginateOptions['limit'] = limit;
        return await this.jobModel["paginate"](filter, paginateOptions);
    }
    async remove(id) {
        const job = await this.jobModel.findById(id);
        if (!job) {
            throw new common_1.NotFoundException();
        }
        await this.licensekeyService.removeReservedDetailsInLicence(job.license, job.id).catch(err => {
            throw new common_1.BadRequestException('Error removing reserved licence count ', err.message || "");
        });
        return this.jobModel.findOneAndDelete({ _id: job.id });
    }
    async makeCompleted(jobId) {
        const job = await this.jobModel.findById(jobId);
        if (!job) {
            throw new common_1.NotFoundException();
        }
        if (job.isComplete) {
            return job;
        }
        await this.licensekeyService.removeReservedDetailsInLicence(job.license, job.id).catch(err => {
            throw new common_1.BadRequestException('Error removing reserved licence count ');
        });
        const completedJob = await this.jobModel.findOneAndUpdate({ _id: job.id }, {
            isComplete: true,
            completedAt: new Date()
        }, { new: true });
        return completedJob;
    }
};
JobService = __decorate([
    common_1.Injectable(),
    __param(0, mongoose_1.InjectModel(job_schema_1.Job.name)),
    __param(1, mongoose_1.InjectModel(jobfile_schema_1.JobFile.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        licensekey_service_1.LicensekeyService])
], JobService);
exports.JobService = JobService;
//# sourceMappingURL=job.service.js.map