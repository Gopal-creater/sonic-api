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
exports.AddKeyAndUpdateJobFileDto = exports.UpdateJobFileDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const create_sonickey_dto_1 = require("../../sonickey/dtos/create-sonickey.dto");
const create_job_file_dto_1 = require("./create-job-file.dto");
class UpdateJobFileDto extends (0, swagger_1.PartialType)(create_job_file_dto_1.CreateJobFileDto) {
    static _OPENAPI_METADATA_FACTORY() {
        return { isComplete: { required: false, type: () => Boolean } };
    }
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], UpdateJobFileDto.prototype, "isComplete", void 0);
exports.UpdateJobFileDto = UpdateJobFileDto;
class AddKeyAndUpdateJobFileDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { jobFile: { required: true, type: () => require("./update-job-file.dto").UpdateJobFileDto }, sonicKeyDetail: { required: true, type: () => require("../../sonickey/dtos/create-sonickey.dto").CreateSonicKeyFromJobDto } };
    }
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", UpdateJobFileDto)
], AddKeyAndUpdateJobFileDto.prototype, "jobFile", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", create_sonickey_dto_1.CreateSonicKeyFromJobDto)
], AddKeyAndUpdateJobFileDto.prototype, "sonicKeyDetail", void 0);
exports.AddKeyAndUpdateJobFileDto = AddKeyAndUpdateJobFileDto;
//# sourceMappingURL=update-job-file.dto.js.map