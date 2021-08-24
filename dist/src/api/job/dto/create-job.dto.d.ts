import { Job } from '../schemas/job.schema';
import { CreateJobFileDto } from './create-job-file.dto';
declare const CreateJobDto_base: import("@nestjs/common").Type<Omit<Job, "isComplete" | "jobFiles">>;
export declare class CreateJobDto extends CreateJobDto_base {
    jobFiles?: CreateJobFileDto[];
}
export {};
