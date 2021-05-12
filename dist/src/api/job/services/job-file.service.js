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
const keygen_service_1 = require("../../../shared/modules/keygen/keygen.service");
const jobfile_schema_1 = require("../schemas/jobfile.schema");
const mongoose_1 = require("mongoose");
const mongoose_2 = require("@nestjs/mongoose");
let JobFileService = class JobFileService {
    constructor(jobFileModel, jobService, keygenService, sonickeyService) {
        this.jobFileModel = jobFileModel;
        this.jobService = jobService;
        this.keygenService = keygenService;
        this.sonickeyService = sonickeyService;
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
        return await this.jobFileModel["paginate"](filter, paginateOptions);
    }
    async addKeyToDbAndUpdateJobFile(jobId, fileId, addKeyAndUpdateJobFileDto) {
        const job = await this.jobService.jobModel.findById(jobId);
        const jobFile = await this.jobService.jobFileModel.findOne({ _id: fileId, job: job });
        console.log("jobFile", jobFile);
        if (!jobFile) {
            throw new common_1.NotFoundException();
        }
        var createdSonicKey = await this.sonickeyService.findBySonicKey(addKeyAndUpdateJobFileDto.sonicKeyDetail.sonicKey);
        if (!createdSonicKey) {
            createdSonicKey = (await this.sonickeyService.createFromJob(addKeyAndUpdateJobFileDto.sonicKeyDetail));
        }
        const updatedJobFile = await this.jobService.jobFileModel.findOneAndUpdate({ _id: fileId }, Object.assign(Object.assign({}, addKeyAndUpdateJobFileDto.jobFile), { sonicKey: createdSonicKey.sonicKey }), { new: true });
        return {
            createdSonicKey: createdSonicKey,
            updatedJobFile: updatedJobFile,
        };
    }
};
JobFileService = __decorate([
    common_1.Injectable(),
    __param(0, mongoose_2.InjectModel(jobfile_schema_1.JobFile.name)),
    __metadata("design:paramtypes", [mongoose_1.Model,
        job_service_1.JobService,
        keygen_service_1.KeygenService,
        sonickey_service_1.SonickeyService])
], JobFileService);
exports.JobFileService = JobFileService;
//# sourceMappingURL=job-file.service.js.map