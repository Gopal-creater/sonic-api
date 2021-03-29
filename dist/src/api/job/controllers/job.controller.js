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
const job_license_validation_guard_1 = require("../../auth/guards/job-license-validation.guard");
const uuid_1 = require("uuid");
const sonickey_service_1 = require("../../sonickey/sonickey.service");
let JobController = class JobController {
    constructor(jobService, sonickeyService) {
        this.jobService = jobService;
        this.sonickeyService = sonickeyService;
    }
    async create(createJobDto, owner, req) {
        createJobDto.owner = owner;
        createJobDto.jobDetails = createJobDto.jobDetails.map((job) => {
            job["fileId"] = uuid_1.v4();
            job["isComplete"] = false;
            job["sonicKey"] = this.sonickeyService.generateUniqueSonicKey();
            return job;
        });
        return this.jobService.create(createJobDto);
    }
    findAll() {
        return this.jobService.findAll();
    }
    makeCompleted(id) {
        return this.jobService.makeCompleted(id);
    }
    findOne(id) {
        return this.jobService.findOne(id);
    }
    async getOwnersJobs(ownerId) {
        return this.jobService.findByOwner(ownerId);
    }
    update(id, updateJobDto) {
        return this.jobService.update(id, updateJobDto);
    }
    remove(id) {
        return this.jobService.remove(id);
    }
    async createTable() {
        return await this.jobService.jobRepository
            .ensureTableExistsAndCreate()
            .then(() => 'Created New Table');
    }
};
__decorate([
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard, job_license_validation_guard_1.JobLicenseValidationGuard),
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
    swagger_1.ApiOperation({ summary: 'Get All Jobs' }),
    swagger_1.ApiBearerAuth(),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    common_1.Get(),
    openapi.ApiResponse({ status: 200, type: [require("../../../schemas/job.schema").Job] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], JobController.prototype, "findAll", null);
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
    swagger_1.ApiOperation({ summary: 'Get One Job' }),
    swagger_1.ApiBearerAuth(),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    common_1.Get(':id'),
    openapi.ApiResponse({ status: 200, type: require("../../../schemas/job.schema").Job }),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], JobController.prototype, "findOne", null);
__decorate([
    swagger_1.ApiOperation({ summary: 'Get All Jobs of particular user' }),
    swagger_1.ApiBearerAuth(),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    common_1.Get('/owners/:ownerId'),
    openapi.ApiResponse({ status: 200, type: [require("../../../schemas/job.schema").Job] }),
    __param(0, common_1.Param('ownerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], JobController.prototype, "getOwnersJobs", null);
__decorate([
    swagger_1.ApiOperation({ summary: 'Update one Job' }),
    swagger_1.ApiBearerAuth(),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    common_1.Put(':id'),
    openapi.ApiResponse({ status: 200, type: require("../../../schemas/job.schema").Job }),
    __param(0, common_1.Param('id')), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_job_dto_1.UpdateJobDto]),
    __metadata("design:returntype", void 0)
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
    __metadata("design:returntype", void 0)
], JobController.prototype, "remove", null);
__decorate([
    common_1.Get('/new/create-table'),
    swagger_1.ApiOperation({ summary: 'Create Job table in Dynamo DB' }),
    openapi.ApiResponse({ status: 200, type: String }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], JobController.prototype, "createTable", null);
JobController = __decorate([
    swagger_1.ApiTags('Jobs Controller'),
    common_1.Controller('jobs'),
    __metadata("design:paramtypes", [job_service_1.JobService, sonickey_service_1.SonickeyService])
], JobController);
exports.JobController = JobController;
//# sourceMappingURL=job.controller.js.map