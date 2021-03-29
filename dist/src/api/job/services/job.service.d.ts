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
    create(createJobDto: CreateJobDto): Promise<Job>;
    findAll(): Promise<Job[]>;
    findOne(id: string): Promise<Job>;
    update(id: string, updateJobDto: UpdateJobDto): Promise<Job>;
    updateJobDetailByFileId(id: string, fileId: string, updateJobFileDto: UpdateJobFileDto): Promise<Job | NotFoundException>;
    remove(id: string): Promise<Job>;
    makeCompleted(jobId: string): Promise<Job>;
    addReservedDetailsInLicence(licenseId: string, reserves: {
        jobId: string;
        count: number;
    }[]): Promise<any>;
    removeReservedDetailsInLicence(licenseId: string, jobId: string): Promise<any>;
    findByOwner(owner: string): Promise<Job[]>;
}
