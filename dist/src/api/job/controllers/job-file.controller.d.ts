import { UpdateJobFileDto, AddKeyAndUpdateJobFileDto } from '../dto/update-job-file.dto';
import { JobFileService } from '../services/job-file.service';
export declare class JobFileController {
    private readonly jobFileService;
    constructor(jobFileService: JobFileService);
    addKeyToDbAndUpdateJobFile(jobId: string, fileId: string, addKeyAndUpdateJobFileDto: AddKeyAndUpdateJobFileDto): Promise<import("@nestjs/common").NotFoundException | {
        createdSonicKey: import("../../../schemas/sonickey.schema").SonicKey;
        fileDetail: {
            [x: string]: any;
        } & {
            [key: string]: any;
        } & {
            fileId: string;
        };
        updatedJob: import("../../../schemas/job.schema").Job;
    }>;
    updateJobFile(jobId: string, fileId: string, updateJobFileDto: UpdateJobFileDto): Promise<import("../../../schemas/job.schema").Job | import("@nestjs/common").NotFoundException>;
}
