import { NotFoundException } from '@nestjs/common';
import { JobRepository } from '../../../repositories/job.repository';
import { UpdateJobFileDto } from '../dto/update-job-file.dto';
import { JobService } from './job.service';
export declare class JobFileService {
    readonly jobRepository: JobRepository;
    readonly jobService: JobService;
    constructor(jobRepository: JobRepository, jobService: JobService);
    update(jobId: string, fileId: string, updateJobFileDto: UpdateJobFileDto): Promise<NotFoundException | (import("../../../schemas/job.schema").Job & {
        id: string;
    })>;
}
