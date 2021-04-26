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
const job_schema_1 = require("../../../schemas/job.schema");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const keygen_service_1 = require("../../../shared/modules/keygen/keygen.service");
const utils_1 = require("../../../shared/utils");
const jobfile_schema_1 = require("../../../schemas/jobfile.schema");
let JobService = class JobService {
    constructor(jobModel, jobFileModel, keygenService) {
        this.jobModel = jobModel;
        this.jobFileModel = jobFileModel;
        this.keygenService = keygenService;
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
        await this.addReservedDetailsInLicence(createJobDto.license, [
            { jobId: createdJob.id, count: updatedCreatedJob.jobFiles.length },
        ]).catch(async (err) => {
            await this.jobModel.remove({ _id: createdJob._id });
            await this.jobFileModel.remove({ job: createdJob._id });
            throw new common_1.BadRequestException('Error adding reserved licence count');
        });
        return updatedCreatedJob;
    }
    async findAll(queryDto = {}) {
        var _a;
        const { _limit, _start, _sort } = queryDto, query = __rest(queryDto, ["_limit", "_start", "_sort"]);
        var sort = {};
        if (_sort) {
            var sortItems = (_sort === null || _sort === void 0 ? void 0 : _sort.split(',')) || [];
            for (let index = 0; index < sortItems.length; index++) {
                const sortItem = sortItems[index];
                var sortKeyValue = sortItem === null || sortItem === void 0 ? void 0 : sortItem.split(':');
                sort[sortKeyValue[0]] = ((_a = sortKeyValue[1]) === null || _a === void 0 ? void 0 : _a.toLowerCase()) == 'desc' ? -1 : 1;
            }
        }
        return this.jobModel
            .find(query || {})
            .skip(_start)
            .limit(_limit)
            .sort(sort)
            .exec();
    }
    async remove(id) {
        const job = await this.jobModel.findById(id);
        if (!job) {
            throw new common_1.NotFoundException();
        }
        await this.removeReservedDetailsInLicence(job.license, job.id).catch(err => {
            throw new common_1.BadRequestException('Error removing reserved licence count ');
        });
        await this.jobFileModel.remove({ job: id });
        return this.jobModel.findOneAndDelete({ _id: job.id });
    }
    async makeCompleted(jobId) {
        const job = await this.jobModel.findById(jobId);
        if (job.isComplete) {
            return job;
        }
        const totalCompletedFiles = job.jobFiles.filter(file => file.isComplete == true);
        const totalInCompletedFiles = job.jobFiles.filter(file => file.isComplete == false);
        await this.removeReservedDetailsInLicence(job.license, job.id).catch(err => {
            throw new common_1.BadRequestException('Error removing reserved licence count ');
        });
        await this.keygenService
            .decrementUsage(job.license, totalCompletedFiles.length)
            .catch(err => {
            throw new common_1.BadRequestException('Error decrementing licence usages');
        });
        const completedJob = await this.jobModel.findOneAndUpdate({ _id: job.id }, {
            isComplete: true,
            completedAt: new Date()
        }, { new: true })
            .catch(async (err) => {
            await this.keygenService.incrementUsage(job.license, totalCompletedFiles.length);
            throw new common_1.BadRequestException('Error making job completed');
        });
        return completedJob;
    }
    async addReservedDetailsInLicence(licenseId, reserves) {
        var _a, _b, _c;
        const { data, errors } = await this.keygenService.getLicenseById(licenseId);
        const oldReserves = utils_1.JSONUtils.parse((_b = (_a = data === null || data === void 0 ? void 0 : data.attributes) === null || _a === void 0 ? void 0 : _a.metadata) === null || _b === void 0 ? void 0 : _b.reserves, []);
        const { data: updatedData, errors: errorsUpdate, } = await this.keygenService.updateLicense(licenseId, {
            metadata: Object.assign(Object.assign({}, (_c = data === null || data === void 0 ? void 0 : data.attributes) === null || _c === void 0 ? void 0 : _c.metadata), { reserves: JSON.stringify([...oldReserves, ...reserves]) }),
        });
        if (errorsUpdate)
            return Promise.reject(errorsUpdate);
        return updatedData;
    }
    async removeReservedDetailsInLicence(licenseId, jobId) {
        var _a, _b, _c;
        const { data, errors } = await this.keygenService.getLicenseById(licenseId);
        const oldReserves = utils_1.JSONUtils.parse((_b = (_a = data === null || data === void 0 ? void 0 : data.attributes) === null || _a === void 0 ? void 0 : _a.metadata) === null || _b === void 0 ? void 0 : _b.reserves, []);
        const { data: updatedData, errors: errorsUpdate, } = await this.keygenService.updateLicense(licenseId, {
            metadata: Object.assign(Object.assign({}, (_c = data === null || data === void 0 ? void 0 : data.attributes) === null || _c === void 0 ? void 0 : _c.metadata), { reserves: JSON.stringify(oldReserves === null || oldReserves === void 0 ? void 0 : oldReserves.filter(reser => reser.jobId !== jobId)) }),
        });
        if (errorsUpdate)
            return Promise.reject(errorsUpdate);
        return updatedData;
    }
    async incrementReservedDetailsInLicenceBy(licenseId, jobId, count) {
        var _a, _b, _c;
        const { data, errors } = await this.keygenService.getLicenseById(licenseId);
        const oldReserves = utils_1.JSONUtils.parse((_b = (_a = data === null || data === void 0 ? void 0 : data.attributes) === null || _a === void 0 ? void 0 : _a.metadata) === null || _b === void 0 ? void 0 : _b.reserves, []);
        const updatedReserves = oldReserves.map(reserve => {
            if (reserve.jobId == jobId) {
                reserve.count = reserve.count + count;
            }
            return reserve;
        });
        const { data: updatedData, errors: errorsUpdate, } = await this.keygenService.updateLicense(licenseId, {
            metadata: Object.assign(Object.assign({}, (_c = data === null || data === void 0 ? void 0 : data.attributes) === null || _c === void 0 ? void 0 : _c.metadata), { reserves: JSON.stringify(updatedReserves) }),
        });
        if (errorsUpdate)
            return Promise.reject(errorsUpdate);
        return updatedData;
    }
    async decrementReservedDetailsInLicenceBy(licenseId, jobId, count) {
        var _a, _b, _c;
        const { data, errors } = await this.keygenService.getLicenseById(licenseId);
        const oldReserves = utils_1.JSONUtils.parse((_b = (_a = data === null || data === void 0 ? void 0 : data.attributes) === null || _a === void 0 ? void 0 : _a.metadata) === null || _b === void 0 ? void 0 : _b.reserves, []);
        const updatedReserves = oldReserves.map(reserve => {
            if (reserve.jobId == jobId) {
                reserve.count = reserve.count - count;
            }
            return reserve;
        });
        const { data: updatedData, errors: errorsUpdate, } = await this.keygenService.updateLicense(licenseId, {
            metadata: Object.assign(Object.assign({}, (_c = data === null || data === void 0 ? void 0 : data.attributes) === null || _c === void 0 ? void 0 : _c.metadata), { reserves: JSON.stringify(updatedReserves) }),
        });
        if (errorsUpdate)
            return Promise.reject(errorsUpdate);
        return updatedData;
    }
};
JobService = __decorate([
    common_1.Injectable(),
    __param(0, mongoose_1.InjectModel(job_schema_1.Job.name)),
    __param(1, mongoose_1.InjectModel(jobfile_schema_1.JobFile.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        keygen_service_1.KeygenService])
], JobService);
exports.JobService = JobService;
//# sourceMappingURL=job.service.js.map