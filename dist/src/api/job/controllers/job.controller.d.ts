import { JobService } from '../services/job.service';
import { CreateJobDto } from '../dto/create-job.dto';
import { UpdateJobDto } from '../dto/update-job.dto';
import { SonickeyService } from '../../sonickey/sonickey.service';
import { UpdateJobFileDto } from '../dto/update-job-file.dto';
export declare class JobController {
    private readonly jobService;
    private readonly sonickeyService;
    constructor(jobService: JobService, sonickeyService: SonickeyService);
    create(createJobDto: CreateJobDto, owner: string, req: any): Promise<CreateJobDto>;
    findAll(): Promise<any[]>;
    makeCompleted(id: string): Promise<import("../../../schemas/job.schema").Job & {
        id: string;
    } & {
        isComplete: boolean;
        completedAt: Date;
    }>;
    findOne(id: string): Promise<import("../../../schemas/job.schema").Job & {
        id: string;
    }>;
    getOwnersJobs(ownerId: string): Promise<import("../../../schemas/job.schema").Job[]>;
    update(id: string, updateJobDto: UpdateJobDto): Promise<import("../../../schemas/job.schema").Job & {
        id: string;
    } & UpdateJobDto>;
    updateJobDetailByFileId(id: string, fileId: string, updateJobFileDto: UpdateJobFileDto): Promise<import("@nestjs/common").NotFoundException | (import("../../../schemas/job.schema").Job & {
        id: string;
    })>;
    remove(id: string): Promise<import("../../../schemas/job.schema").Job & {
        id: string;
    }>;
    createTable(): Promise<string>;
}
