import { CreateSonicKeyFromJobDto } from '../../sonickey/dtos/create-sonickey.dto';
import { CreateJobFileDto } from './create-job-file.dto';
declare const UpdateJobFileDto_base: import("@nestjs/common").Type<Partial<CreateJobFileDto>>;
export declare class UpdateJobFileDto extends UpdateJobFileDto_base {
    isComplete?: boolean;
}
export declare class AddKeyAndUpdateJobFileDto {
    jobFile: UpdateJobFileDto;
    sonicKeyDetail: CreateSonicKeyFromJobDto;
}
export {};
