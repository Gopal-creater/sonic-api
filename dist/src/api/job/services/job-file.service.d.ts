import { NotFoundException } from '@nestjs/common';
import { JobRepository } from '../../../repositories/job.repository';
import { UpdateJobFileDto, AddKeyAndUpdateJobFileDto } from '../dto/update-job-file.dto';
import { JobService } from './job.service';
import { SonickeyService } from '../../sonickey/sonickey.service';
import { SonicKey } from '../../../schemas/sonickey.schema';
export declare class JobFileService {
    readonly jobRepository: JobRepository;
    readonly jobService: JobService;
    readonly sonickeyService: SonickeyService;
    constructor(jobRepository: JobRepository, jobService: JobService, sonickeyService: SonickeyService);
    updateJobFile(jobId: string, fileId: string, updateJobFileDto: UpdateJobFileDto): Promise<import("../../../schemas/job.schema").Job | NotFoundException>;
    addKeyToDbAndUpdateJobFile(jobId: string, fileId: string, addKeyAndUpdateJobFileDto: AddKeyAndUpdateJobFileDto): Promise<NotFoundException | {
        createdSonicKey: SonicKey;
        fileDetail: {
            [x: string]: any;
        } & {
            [key: string]: any;
        } & {
            fileId: string;
        };
        updatedJob: import("../../../schemas/job.schema").Job;
    }>;
}
