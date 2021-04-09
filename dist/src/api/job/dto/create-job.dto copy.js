"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateJobDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const job_schema_1 = require("../../../schemas/job.schema");
class CreateJobDto extends swagger_1.OmitType(job_schema_1.Job, [
    'isComplete'
]) {
}
exports.CreateJobDto = CreateJobDto;
//# sourceMappingURL=create-job.dto copy.js.map