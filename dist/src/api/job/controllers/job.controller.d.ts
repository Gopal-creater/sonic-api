import { JobService } from '../services/job.service';
import { CreateJobDto } from '../dto/create-job.dto';
import { UpdateJobDto } from '../dto/update-job.dto';
import { SonickeyService } from '../../sonickey/services/sonickey.service';
import { ParsedQueryDto } from '../../../shared/dtos/parsedquery.dto';
export declare class JobController {
    private readonly jobService;
    private readonly sonickeyService;
    constructor(jobService: JobService, sonickeyService: SonickeyService);
    findAll(queryDto: ParsedQueryDto): Promise<import("../dto/mongoosepaginate-job.dto").MongoosePaginateJobDto>;
    getOwnerJobs(ownerId: string, queryDto: ParsedQueryDto): Promise<import("../dto/mongoosepaginate-job.dto").MongoosePaginateJobDto>;
    create(createJobDto: CreateJobDto, owner: string, req: any): Promise<import("../schemas/job.schema").Job>;
    makeCompleted(id: string): Promise<import("../schemas/job.schema").Job>;
    getCount(queryDto: ParsedQueryDto): Promise<number>;
    findOne(id: string): Promise<import("../schemas/job.schema").Job>;
    update(id: string, updateJobDto: UpdateJobDto): Promise<import("../schemas/job.schema").Job>;
    remove(id: string): Promise<import("../schemas/job.schema").Job>;
}
