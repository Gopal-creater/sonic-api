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
const job_repository_1 = require("../../repositories/job.repository");
const job_schema_1 = require("../../schemas/job.schema");
let JobService = class JobService {
    constructor(jobRepository) {
        this.jobRepository = jobRepository;
    }
    create(createJobDto) {
        return this.jobRepository.put(createJobDto);
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
        return this.jobRepository.get(Object.assign(new job_schema_1.Job, { id: id }));
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
        const updatedFile = Object.assign(oldFile, updateJobFileDto, { fileId: fileId });
        return this.jobRepository.update(job);
    }
    remove(id) {
        return this.jobRepository.delete(Object.assign(new job_schema_1.Job, { id: id }));
    }
    async makeCompleted(id) {
        const job = await this.findOne(id);
        return this.jobRepository.update(Object.assign(job, { isComplete: true, completedAt: new Date() }));
    }
    async findByOwner(owner) {
        var e_2, _a;
        var items = [];
        try {
            for (var _b = __asyncValues(this.jobRepository.query(job_schema_1.Job, { owner: owner }, { indexName: 'ownerIndex' })), _c; _c = await _b.next(), !_c.done;) {
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
    __metadata("design:paramtypes", [job_repository_1.JobRepository])
], JobService);
exports.JobService = JobService;
//# sourceMappingURL=job.service.js.map