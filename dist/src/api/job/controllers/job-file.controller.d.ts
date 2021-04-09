/// <reference types="mongoose" />
import { UpdateJobFileDto, AddKeyAndUpdateJobFileDto } from '../dto/update-job-file.dto';
import { JobFileService } from '../services/job-file.service';
import { JobService } from '../services/job.service';
import { CreateJobFileDto } from '../dto/create-job-file.dto';
import { JobFile } from '../../../schemas/jobfile.schema';
import { QueryDto } from '../../../shared/dtos/query.dto';
export declare class JobFileController {
    private readonly jobFileService;
    private readonly jobService;
    constructor(jobFileService: JobFileService, jobService: JobService);
    findAll(queryDto: QueryDto): Promise<JobFile[]>;
    addKeyToDbAndUpdateJobFile(fileId: string, addKeyAndUpdateJobFileDto: AddKeyAndUpdateJobFileDto): Promise<{
        createdSonicKey: import("../../../schemas/sonickey.schema").SonicKey;
        updatedJobFile: JobFile;
    }>;
    updateJobFile(id: string, updateJobFileDto: UpdateJobFileDto): Promise<import("mongoose").UpdateWriteOpResult>;
    createJobFile(createJobFileDto: CreateJobFileDto): Promise<JobFile>;
    addFilesToJob(createJobFileDto: CreateJobFileDto[]): Promise<JobFile[]>;
    deleteJobFile(id: string): Promise<JobFile>;
}
