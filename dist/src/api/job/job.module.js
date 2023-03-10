"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobModule = void 0;
const common_1 = require("@nestjs/common");
const job_service_1 = require("./services/job.service");
const job_controller_1 = require("./controllers/job.controller");
const job_file_controller_1 = require("./controllers/job-file.controller");
const sonickey_module_1 = require("../sonickey/sonickey.module");
const job_file_service_1 = require("./services/job-file.service");
const mongoose_1 = require("@nestjs/mongoose");
const job_schema_1 = require("./schemas/job.schema");
const jobfile_schema_1 = require("./schemas/jobfile.schema");
const licensekey_module_1 = require("../licensekey/licensekey.module");
let JobModule = class JobModule {
};
JobModule = __decorate([
    common_1.Module({
        imports: [
            sonickey_module_1.SonickeyModule,
            licensekey_module_1.LicensekeyModule,
            mongoose_1.MongooseModule.forFeature([
                { name: job_schema_1.JobSchemaName, schema: job_schema_1.JobSchema },
                { name: jobfile_schema_1.JobFileSchemaName, schema: jobfile_schema_1.JobFileSchema },
            ]),
        ],
        controllers: [job_controller_1.JobController, job_file_controller_1.JobFileController],
        providers: [job_service_1.JobService, job_file_service_1.JobFileService],
    })
], JobModule);
exports.JobModule = JobModule;
//# sourceMappingURL=job.module.js.map