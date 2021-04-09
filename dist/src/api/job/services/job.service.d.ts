import { CreateJobDto } from '../dto/create-job.dto';
import { JobRepository } from '../../../repositories/job.repository';
import { Job } from '../../../schemas/job.schema';
import { Model } from 'mongoose';
import { KeygenService } from '../../../shared/modules/keygen/keygen.service';
import { QueryDto } from '../../../shared/dtos/query.dto';
import { JobFile } from '../../../schemas/jobfile.schema';
export declare class JobService {
    jobModel: Model<Job>;
    jobFileModel: Model<JobFile>;
    readonly jobRepository: JobRepository;
    readonly keygenService: KeygenService;
    constructor(jobModel: Model<Job>, jobFileModel: Model<JobFile>, jobRepository: JobRepository, keygenService: KeygenService);
    create(createJobDto: CreateJobDto): Promise<Job>;
    findAll(queryDto?: QueryDto): Promise<Job[]>;
    remove(id: string): Promise<Job>;
    makeCompleted(jobId: string): Promise<Job>;
    addReservedDetailsInLicence(licenseId: string, reserves: {
        jobId: string;
        count: number;
    }[]): Promise<any>;
    removeReservedDetailsInLicence(licenseId: string, jobId: string): Promise<any>;
    incrementReservedDetailsInLicenceBy(licenseId: string, jobId: string, count: number): Promise<any>;
    decrementReservedDetailsInLicenceBy(licenseId: string, jobId: string, count: number): Promise<any>;
}
