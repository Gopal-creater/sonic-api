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
exports.JobFileService = void 0;
const common_1 = require("@nestjs/common");
const job_service_1 = require("./job.service");
const sonickey_service_1 = require("../../sonickey/services/sonickey.service");
const jobfile_schema_1 = require("../schemas/jobfile.schema");
const mongoose_1 = require("mongoose");
const mongoose_2 = require("@nestjs/mongoose");
const licensekey_service_1 = require("../../licensekey/services/licensekey.service");
let JobFileService = class JobFileService {
    constructor(jobFileModel, jobService, sonickeyService, licensekeyService) {
        this.jobFileModel = jobFileModel;
        this.jobService = jobService;
        this.sonickeyService = sonickeyService;
        this.licensekeyService = licensekeyService;
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
        return await this.jobFileModel['paginate'](filter, paginateOptions);
    }
    async addKeyToDbAndUpdateJobFile(jobId, fileId, addKeyAndUpdateJobFileDto) {
        const job = await this.jobService.jobModel.findById(jobId);
        const jobFile = await this.jobService.jobFileModel.findOne({
            _id: fileId,
            job: job,
        });
        if (!jobFile) {
            throw new common_1.NotFoundException();
        }
        var createdSonicKey = await this.sonickeyService.findBySonicKey(addKeyAndUpdateJobFileDto.sonicKeyDetail.sonicKey);
        if (!createdSonicKey) {
            createdSonicKey = (await this.sonickeyService.createFromJob(addKeyAndUpdateJobFileDto.sonicKeyDetail));
        }
        const updatedJobFile = await this.jobService.jobFileModel.findOneAndUpdate({ _id: fileId }, Object.assign(Object.assign({}, addKeyAndUpdateJobFileDto.jobFile), { sonicKey: createdSonicKey.sonicKey }), { new: true });
        if (jobFile.isComplete == false && updatedJobFile.isComplete == true) {
            try {
                await this.licensekeyService.incrementUses(job.license, 'encode', 1);
                await this.licensekeyService.decrementReservedDetailsInLicenceBy(job.license, job._id, 1);
            }
            catch (error) {
                console.log('Error while increment uses or decrement Reserved', error);
                await this.jobService.jobFileModel.findOneAndUpdate({ _id: fileId }, jobFile);
                throw new common_1.UnprocessableEntityException('Error while increment uses or decrement reserved');
            }
        }
        return {
            createdSonicKey: createdSonicKey,
            updatedJobFile: updatedJobFile,
        };
    }
    async updateJobFile(fileId, updateJobFileDto) {
        var _a, _b, _c;
        const jobFile = await this.jobService.jobFileModel.findOne({
            _id: fileId
        }).populate('job').exec();
        if (!jobFile) {
            throw new common_1.NotFoundException();
        }
        const updatedJobFile = await this.jobService.jobFileModel.findOneAndUpdate({ _id: fileId }, updateJobFileDto, { new: true });
        if (jobFile.isComplete == false && updatedJobFile.isComplete == true) {
            try {
                await this.licensekeyService.incrementUses((_a = jobFile === null || jobFile === void 0 ? void 0 : jobFile.job) === null || _a === void 0 ? void 0 : _a.license, 'encode', 1);
                await this.licensekeyService.decrementReservedDetailsInLicenceBy((_b = jobFile === null || jobFile === void 0 ? void 0 : jobFile.job) === null || _b === void 0 ? void 0 : _b.license, (_c = jobFile === null || jobFile === void 0 ? void 0 : jobFile.job) === null || _c === void 0 ? void 0 : _c._id, 1);
            }
            catch (error) {
                console.log('Error while increment uses or decrement Reserved', error);
                await this.jobService.jobFileModel.findOneAndUpdate({ _id: fileId }, jobFile);
                throw new common_1.UnprocessableEntityException('Error while increment uses or decrement reserved');
            }
        }
        return updatedJobFile;
    }
};
JobFileService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)(jobfile_schema_1.JobFile.name)),
    __metadata("design:paramtypes", [mongoose_1.Model,
        job_service_1.JobService,
        sonickey_service_1.SonickeyService,
        licensekey_service_1.LicensekeyService])
], JobFileService);
exports.JobFileService = JobFileService;
//# sourceMappingURL=job-file.service.js.map