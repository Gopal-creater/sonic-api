import { Job } from '../../../schemas/job.schema';
declare const CreateJobDto_base: import("@nestjs/common").Type<Pick<Job, "name" | "owner" | "licenseId" | "jobDetails">>;
export declare class CreateJobDto extends CreateJobDto_base {
}
export {};
