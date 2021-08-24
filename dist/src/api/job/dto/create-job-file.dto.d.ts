import { JobFile } from '../schemas/jobfile.schema';
declare const CreateJobFileDto_base: import("@nestjs/common").Type<Omit<JobFile, "sonicKeyToBe" | "sonicKey" | "isComplete">>;
export declare class CreateJobFileDto extends CreateJobFileDto_base {
}
export {};
