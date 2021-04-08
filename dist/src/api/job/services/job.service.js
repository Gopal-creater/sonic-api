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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobService = void 0;
const common_1 = require("@nestjs/common");
const job_repository_1 = require("../../../repositories/job.repository");
const job_schema_1 = require("../../../schemas/job.schema");
const keygen_service_1 = require("../../../shared/modules/keygen/keygen.service");
const utils_1 = require("../../../shared/utils");
let JobService = class JobService {
    constructor(jobRepository, keygenService) {
        this.jobRepository = jobRepository;
        this.keygenService = keygenService;
    }
    async create(createJobDto) {
        const dataToSave = Object.assign(new job_schema_1.Job(), createJobDto);
        const createdJob = await this.jobRepository.put(dataToSave);
        await this.addReservedDetailsInLicence(createJobDto.licenseId, [
            { jobId: createdJob.id, count: createJobDto.jobDetails.length },
        ]).catch(async (err) => {
            await this.jobRepository.delete(createdJob);
            throw new common_1.BadRequestException('Error adding reserved licence count');
        });
        return createdJob;
    }
    async findAll() {
        var e_1, _a;
        const items = [];
        try {
            for (var _b = __asyncValues(this.jobRepository.scan(job_schema_1.Job)), _c; _c = await _b.next(), !_c.done;) {
                const item = _c.value;
                items.push(item);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) await _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return items;
    }
    findOne(id) {
        return this.jobRepository.get(Object.assign(new job_schema_1.Job(), { id: id }));
    }
    async update(id, updateJobDto) {
        const job = await this.findOne(id);
        return this.jobRepository.update(Object.assign(job, updateJobDto));
    }
    async updateJobDetailByFileId(id, fileId, updateJobFileDto) {
        const job = await this.findOne(id);
        const oldFile = job.jobDetails.find(itm => itm.fileId == fileId);
        if (!oldFile) {
            return new common_1.NotFoundException();
        }
        const updatedFile = Object.assign(oldFile, updateJobFileDto, {
            fileId: fileId,
        });
        const index = job.jobDetails.findIndex(itm => itm.fileId == fileId);
        job.jobDetails[index] = updatedFile;
        return this.jobRepository.update(job);
    }
    async remove(id) {
        const job = await this.findOne(id);
        if (!job) {
            return new common_1.NotFoundException();
        }
        await this.removeReservedDetailsInLicence(job.licenseId, job.id).catch(err => {
            throw new common_1.BadRequestException('Error removing reserved licence count ');
        });
        return this.jobRepository.delete(job);
    }
    async makeCompleted(jobId) {
        const job = await this.findOne(jobId);
        if (job.isComplete) {
            return job;
        }
        const totalCompletedFiles = job.jobDetails.filter(file => file.isComplete == true);
        const totalInCompletedFiles = job.jobDetails.filter(file => file.isComplete == false);
        await this.removeReservedDetailsInLicence(job.licenseId, job.id).catch(err => {
            throw new common_1.BadRequestException('Error removing reserved licence count ');
        });
        await this.keygenService
            .decrementUsage(job.licenseId, totalCompletedFiles.length)
            .catch(err => {
            throw new common_1.BadRequestException('Error decrementing licence usages');
        });
        const completedJob = await this.jobRepository
            .update(Object.assign(job, {
            isComplete: true,
            completedAt: new Date()
        }))
            .catch(async (err) => {
            await this.keygenService.incrementUsage(job.licenseId, totalCompletedFiles.length);
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
    async findByOwner(owner, queryOptions) {
        var e_2, _a;
        var items = [];
        try {
            for (var _b = __asyncValues(this.jobRepository.query(job_schema_1.Job, { owner: owner }, Object.assign({ indexName: 'ownerIndex' }, queryOptions))), _c; _c = await _b.next(), !_c.done;) {
                const item = _c.value;
                items.push(item);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) await _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return items;
    }
};
JobService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [job_repository_1.JobRepository,
        keygen_service_1.KeygenService])
], JobService);
exports.JobService = JobService;
//# sourceMappingURL=job.service.js.map