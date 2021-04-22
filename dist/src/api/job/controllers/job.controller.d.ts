import { JobService } from '../services/job.service';
import { CreateJobDto } from '../dto/create-job.dto';
import { UpdateJobDto } from '../dto/update-job.dto';
import { SonickeyService } from '../../sonickey/services/sonickey.service';
import { QueryDto } from '../../../shared/dtos/query.dto';
export declare class JobController {
    private readonly jobService;
    private readonly sonickeyService;
    constructor(jobService: JobService, sonickeyService: SonickeyService);
    findAll(queryDto: QueryDto): Promise<import("../../../schemas/job.schema").Job[]>;
    getOwnerJobs(ownerId: string, queryDto: QueryDto): Promise<import("../../../schemas/job.schema").Job[]>;
    create(createJobDto: CreateJobDto, owner: string, req: any): Promise<import("../../../schemas/job.schema").Job>;
    makeCompleted(id: string): Promise<import("../../../schemas/job.schema").Job>;
    findOne(id: string): Promise<import("../../../schemas/job.schema").Job>;
    update(id: string, updateJobDto: UpdateJobDto): Promise<import("../../../schemas/job.schema").Job>;
    remove(id: string): Promise<import("../../../schemas/job.schema").Job>;
}
