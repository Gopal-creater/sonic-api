import { JobService } from '../services/job.service';
import { CreateJobDto } from '../dto/create-job.dto';
import { UpdateJobDto } from '../dto/update-job.dto';
import { SonickeyService } from '../../sonickey/sonickey.service';
export declare class JobController {
    private readonly jobService;
    private readonly sonickeyService;
    constructor(jobService: JobService, sonickeyService: SonickeyService);
    create(createJobDto: CreateJobDto, owner: string, req: any): Promise<import("../../../schemas/job.schema").Job>;
    findAll(): Promise<import("../../../schemas/job.schema").Job[]>;
    makeCompleted(id: string): Promise<import("../../../schemas/job.schema").Job>;
    findOne(id: string): Promise<import("../../../schemas/job.schema").Job>;
    getOwnersJobs(ownerId: string): Promise<import("../../../schemas/job.schema").Job[]>;
    update(id: string, updateJobDto: UpdateJobDto): Promise<import("../../../schemas/job.schema").Job>;
    remove(id: string): Promise<import("../../../schemas/job.schema").Job>;
    createTable(): Promise<string>;
}
