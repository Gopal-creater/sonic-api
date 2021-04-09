"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateJobFileDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const jobfile_schema_1 = require("../../../schemas/jobfile.schema");
class CreateJobFileDto extends swagger_1.OmitType(jobfile_schema_1.JobFile, [
    'isComplete',
    'sonicKey'
]) {
}
exports.CreateJobFileDto = CreateJobFileDto;
//# sourceMappingURL=create-job-file.dto1.js.map