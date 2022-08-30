"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateJobFileDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const jobfile_schema_1 = require("../schemas/jobfile.schema");
class CreateJobFileDto extends (0, swagger_1.OmitType)(jobfile_schema_1.JobFile, [
    'isComplete',
    'sonicKey',
    "sonicKeyToBe"
]) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.CreateJobFileDto = CreateJobFileDto;
//# sourceMappingURL=create-job-file.dto.js.map