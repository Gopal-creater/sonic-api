"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateJobDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const create_job_dto_1 = require("./create-job.dto");
class UpdateJobDto extends swagger_1.PartialType(swagger_1.OmitType(create_job_dto_1.CreateJobDto, ['license', 'owner'])) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateJobDto = UpdateJobDto;
//# sourceMappingURL=update-job.dto.js.map