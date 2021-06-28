/// <reference types="mongoose" />
import { UpdateJobFileDto, AddKeyAndUpdateJobFileDto } from '../dto/update-job-file.dto';
import { JobFileService } from '../services/job-file.service';
import { JobService } from '../services/job.service';
import { CreateJobFileDto } from '../dto/create-job-file.dto';
import { ParsedQueryDto } from '../../../shared/dtos/parsedquery.dto';
export declare class JobFileController {
    private readonly jobFileService;
    private readonly jobService;
    constructor(jobFileService: JobFileService, jobService: JobService);
    findAll(queryDto: ParsedQueryDto): Promise<import("../dto/mongoosepaginate-jobfile.dto").MongoosePaginateJobFileDto>;
    getCount(queryDto: ParsedQueryDto): Promise<number>;
    addKeyToDbAndUpdateJobFile(jobId: string, fileId: string, addKeyAndUpdateJobFileDto: AddKeyAndUpdateJobFileDto): Promise<{
        createdSonicKey: import("../../sonickey/schemas/sonickey.schema").SonicKey;
        updatedJobFile: import("../schemas/jobfile.schema").JobFile;
    }>;
    updateJobFile(id: string, updateJobFileDto: UpdateJobFileDto): Promise<import("mongoose").UpdateWriteOpResult>;
    createJobFile(jobId: string, createJobFileDto: CreateJobFileDto): Promise<{
        savedJobFile: import("../schemas/jobfile.schema").JobFile;
        updatedJob: import("../schemas/job.schema").Job;
    }>;
    addFilesToJob(jobId: string, createJobFileDto: CreateJobFileDto[]): Promise<{
        savedJobFiles: import("../schemas/jobfile.schema").JobFile[];
        updatedJob: import("../schemas/job.schema").Job;
    }>;
    deleteJobFile(jobId: string, fileId: string): Promise<{
        deletedJobFile: import("../schemas/jobfile.schema").JobFile;
        updatedJob: import("../schemas/job.schema").Job;
    }>;
}
