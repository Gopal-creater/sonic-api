import { NotFoundException } from '@nestjs/common';
import { CreateJobDto } from '../dto/create-job.dto';
import { UpdateJobDto } from '../dto/update-job.dto';
import { JobRepository } from '../../../repositories/job.repository';
import { Job } from '../../../schemas/job.schema';
import { UpdateJobFileDto } from '../dto/update-job-file.dto';
import { KeygenService } from '../../../shared/modules/keygen/keygen.service';
export declare class JobService {
    readonly jobRepository: JobRepository;
    readonly keygenService: KeygenService;
    constructor(jobRepository: JobRepository, keygenService: KeygenService);
    create(createJobDto: CreateJobDto): Promise<CreateJobDto>;
    findAll(): Promise<any[]>;
    findOne(id: string): Promise<Job & {
        id: string;
    }>;
    update(id: string, updateJobDto: UpdateJobDto): Promise<Job & {
        id: string;
    } & UpdateJobDto>;
    updateJobDetailByFileId(id: string, fileId: string, updateJobFileDto: UpdateJobFileDto): Promise<(Job & {
        id: string;
    }) | NotFoundException>;
    remove(id: string): Promise<Job & {
        id: string;
    }>;
    makeCompleted(id: string): Promise<Job & {
        id: string;
    } & {
        isComplete: boolean;
        completedAt: Date;
    }>;
    addReservedDetailsInLicence(licenseId: string, reserves: {
        jobId: string;
        count: number;
    }[]): Promise<any>;
    removeReservedDetailsInLicence(licenseId: string, jobId: string): Promise<any>;
    findByOwner(owner: string): Promise<Job[]>;
}
