"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateJobDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const job_schema_1 = require("../../../schemas/job.schema");
class CreateJobDto extends swagger_1.OmitType(job_schema_1.Job, [
    'id',
    'isComplete',
    'createdAt',
    'completedAt',
]) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.CreateJobDto = CreateJobDto;
//# sourceMappingURL=create-job.dto.js.map