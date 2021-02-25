import { UpdateJobFileDto } from '../dto/update-job-file.dto';
import { JobFileService } from '../services/job-file.service';
export declare class JobFileController {
    private readonly jobFileService;
    constructor(jobFileService: JobFileService);
    updateJobDetailByFileId(jobId: string, fileId: string, updateJobFileDto: UpdateJobFileDto): Promise<import("@nestjs/common").NotFoundException | (import("../../../schemas/job.schema").Job & {
        id: string;
    })>;
}
