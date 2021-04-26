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
exports.JobController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const job_service_1 = require("../services/job.service");
const create_job_dto_1 = require("../dto/create-job.dto");
const update_job_dto_1 = require("../dto/update-job.dto");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const user_decorator_1 = require("../../auth/decorators/user.decorator");
const sonickey_service_1 = require("../../sonickey/services/sonickey.service");
const common_2 = require("@nestjs/common");
const query_dto_1 = require("../../../shared/dtos/query.dto");
const convertIntObj_pipe_1 = require("../../../shared/pipes/convertIntObj.pipe");
let JobController = class JobController {
    constructor(jobService, sonickeyService) {
        this.jobService = jobService;
        this.sonickeyService = sonickeyService;
    }
    findAll(queryDto) {
        return this.jobService.findAll(queryDto);
    }
    getOwnerJobs(ownerId, queryDto) {
        const query = Object.assign(Object.assign({}, queryDto), { owner: ownerId });
        return this.jobService.findAll(query);
    }
    async create(createJobDto, owner, req) {
        const existingJob = await this.jobService.jobModel.findOne({ name: createJobDto.name, owner: owner });
        if (existingJob) {
            throw new common_2.BadRequestException('Job with same name already exists.');
        }
        createJobDto.owner = owner;
        if (createJobDto.jobFiles) {
            createJobDto.jobFiles = createJobDto.jobFiles.map(job => {
                job['sonicKeyToBe'] = this.sonickeyService.generateUniqueSonicKey();
                return job;
            });
        }
        return this.jobService.create(createJobDto);
    }
    makeCompleted(id) {
        return this.jobService.makeCompleted(id);
    }
    async findOne(id) {
        const job = await this.jobService.jobModel.findById(id);
        if (!job) {
            throw new common_1.NotFoundException();
        }
        return job;
    }
    async update(id, updateJobDto) {
        const updatedJob = await this.jobService.jobModel.findOneAndUpdate({ _id: id }, updateJobDto, { new: true });
        if (!updatedJob) {
            throw new common_1.NotFoundException();
        }
        return updatedJob;
    }
    async remove(id) {
        const deletedJob = await this.jobService.remove(id);
        if (!deletedJob) {
            throw new common_1.NotFoundException();
        }
        return deletedJob;
    }
};
__decorate([
    swagger_1.ApiOperation({ summary: 'Get All Jobs' }),
    swagger_1.ApiBearerAuth(),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    common_1.Get(),
    openapi.ApiResponse({ status: 200, type: [require("../../../schemas/job.schema").Job] }),
    __param(0, common_1.Query(new convertIntObj_pipe_1.ConvertIntObj(['limit', 'offset']))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_dto_1.QueryDto]),
    __metadata("design:returntype", void 0)
], JobController.prototype, "findAll", null);
__decorate([
    swagger_1.ApiOperation({ summary: 'Get All Jobs of particular owner' }),
    swagger_1.ApiBearerAuth(),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    common_1.Get('/owners/:ownerId'),
    openapi.ApiResponse({ status: 200, type: [require("../../../schemas/job.schema").Job] }),
    __param(0, common_1.Param('ownerId')), __param(1, common_1.Query(new convertIntObj_pipe_1.ConvertIntObj(['limit', 'offset']))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, query_dto_1.QueryDto]),
    __metadata("design:returntype", void 0)
], JobController.prototype, "getOwnerJobs", null);
__decorate([
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({ summary: 'Create a Job' }),
    common_1.Post(),
    openapi.ApiResponse({ status: 201, type: require("../../../schemas/job.schema").Job }),
    __param(0, common_1.Body()),
    __param(1, user_decorator_1.User('sub')),
    __param(2, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_job_dto_1.CreateJobDto, String, Object]),
    __metadata("design:returntype", Promise)
], JobController.prototype, "create", null);
__decorate([
    swagger_1.ApiOperation({ summary: 'Make this job completed' }),
    swagger_1.ApiBearerAuth(),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    common_1.Get(':id/make-completed'),
    openapi.ApiResponse({ status: 200, type: require("../../../schemas/job.schema").Job }),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], JobController.prototype, "makeCompleted", null);
__decorate([
    swagger_1.ApiOperation({ summary: 'Get One Job By Id' }),
    swagger_1.ApiBearerAuth(),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    common_1.Get(':id'),
    openapi.ApiResponse({ status: 200, type: require("../../../schemas/job.schema").Job }),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], JobController.prototype, "findOne", null);
__decorate([
    swagger_1.ApiOperation({ summary: 'Update one Job' }),
    swagger_1.ApiBearerAuth(),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    common_1.Put(':id'),
    openapi.ApiResponse({ status: 200, type: require("../../../schemas/job.schema").Job }),
    __param(0, common_1.Param('id')), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_job_dto_1.UpdateJobDto]),
    __metadata("design:returntype", Promise)
], JobController.prototype, "update", null);
__decorate([
    swagger_1.ApiOperation({ summary: 'Delete one Job' }),
    swagger_1.ApiBearerAuth(),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    common_1.Delete(':id'),
    openapi.ApiResponse({ status: 200, type: require("../../../schemas/job.schema").Job }),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], JobController.prototype, "remove", null);
JobController = __decorate([
    swagger_1.ApiTags('Jobs Controller'),
    common_1.Controller('jobs'),
    __metadata("design:paramtypes", [job_service_1.JobService,
        sonickey_service_1.SonickeyService])
], JobController);
exports.JobController = JobController;
//# sourceMappingURL=job.controller.js.map