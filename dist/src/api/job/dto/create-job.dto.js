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
exports.CreateJobDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const job_schema_1 = require("../schemas/job.schema");
const create_job_file_dto_1 = require("./create-job-file.dto");
class CreateJobDto extends swagger_1.OmitType(job_schema_1.Job, [
    'isComplete',
    'jobFiles'
]) {
    static _OPENAPI_METADATA_FACTORY() {
        return { jobFiles: { required: false, type: () => [require("./create-job-file.dto").CreateJobFileDto] }, licenseId: { required: false, type: () => String } };
    }
}
__decorate([
    swagger_1.ApiProperty({ isArray: true, type: create_job_file_dto_1.CreateJobFileDto, required: false }),
    __metadata("design:type", Array)
], CreateJobDto.prototype, "jobFiles", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], CreateJobDto.prototype, "licenseId", void 0);
exports.CreateJobDto = CreateJobDto;
//# sourceMappingURL=create-job.dto.js.map