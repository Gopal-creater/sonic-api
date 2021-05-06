/// <reference types="mongoose" />
import { UpdateJobFileDto, AddKeyAndUpdateJobFileDto } from '../dto/update-job-file.dto';
import { JobFileService } from '../services/job-file.service';
import { JobService } from '../services/job.service';
import { CreateJobFileDto } from '../dto/create-job-file.dto';
import { JobFile } from '../schemas/jobfile.schema';
import { QueryDto } from '../../../shared/dtos/query.dto';
export declare class JobFileController {
    private readonly jobFileService;
    private readonly jobService;
    constructor(jobFileService: JobFileService, jobService: JobService);
    findAll(queryDto: QueryDto): Promise<import("../dto/mongoosepaginate-jobfile.dto").MongoosePaginateJobFileDto>;
    getCount(query: any): Promise<number>;
    addKeyToDbAndUpdateJobFile(jobId: string, fileId: string, addKeyAndUpdateJobFileDto: AddKeyAndUpdateJobFileDto): Promise<{
        createdSonicKey: import("../../sonickey/schemas/sonickey.schema").SonicKey;
        updatedJobFile: JobFile;
    }>;
    updateJobFile(id: string, updateJobFileDto: UpdateJobFileDto): Promise<import("mongoose").UpdateWriteOpResult>;
    createJobFile(jobId: string, createJobFileDto: CreateJobFileDto): Promise<{
        savedJobFile: JobFile;
        updatedJob: import("../schemas/job.schema").Job;
    }>;
    addFilesToJob(jobId: string, createJobFileDto: CreateJobFileDto[]): Promise<{
        savedJobFiles: JobFile[];
        updatedJob: import("../schemas/job.schema").Job;
    }>;
    deleteJobFile(jobId: string, fileId: string): Promise<{
        deletedJobFile: JobFile;
        updatedJob: import("../schemas/job.schema").Job;
    }>;
}
