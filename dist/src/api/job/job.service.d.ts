import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { JobRepository } from '../../repositories/job.repository';
export declare class JobService {
    readonly jobRepository: JobRepository;
    constructor(jobRepository: JobRepository);
    create(createJobDto: CreateJobDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateJobDto: UpdateJobDto): string;
    updateJobDetailByFilePath(id: string, filePath: string, updateJobDto: UpdateJobDto): string;
    remove(id: string): string;
    findByOwner(owner: string): string;
}
