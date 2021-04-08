import { UpdateJobFileDto, AddKeyAndUpdateJobFileDto } from '../dto/update-job-file.dto';
import { JobFileService } from '../services/job-file.service';
import { AddFilesDto } from '../dto/add-files.dto';
import { JobService } from '../services/job.service';
export declare class JobFileController {
    private readonly jobFileService;
    private readonly jobService;
    constructor(jobFileService: JobFileService, jobService: JobService);
    addKeyToDbAndUpdateJobFile(jobId: string, fileId: string, addKeyAndUpdateJobFileDto: AddKeyAndUpdateJobFileDto): Promise<{
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
    updateJobFile(jobId: string, fileId: string, updateJobFileDto: UpdateJobFileDto): Promise<{
        fileDetail: {
            [x: string]: any;
        } & {
            [key: string]: any;
        } & {
            fileId: string;
        };
        updatedJob: import("../../../schemas/job.schema").Job;
    }>;
    addFilesToJob(jobId: string, addFilesDto: AddFilesDto): Promise<import("../../../schemas/job.schema").Job>;
    deleteJobFile(jobId: string, fileId: string): Promise<import("../../../schemas/job.schema").Job>;
}
