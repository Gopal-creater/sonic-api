import { CreateJobDto } from '../dto/create-job.dto';
import { Job } from '../schemas/job.schema';
import { Model } from 'mongoose';
import { JobFile } from '../schemas/jobfile.schema';
import { MongoosePaginateJobDto } from '../dto/mongoosepaginate-job.dto';
import { ParsedQueryDto } from '../../../shared/dtos/parsedquery.dto';
import { LicensekeyService } from '../../licensekey/services/licensekey.service';
export declare class JobService {
    readonly jobModel: Model<Job>;
    readonly jobFileModel: Model<JobFile>;
    readonly licensekeyService: LicensekeyService;
    constructor(jobModel: Model<Job>, jobFileModel: Model<JobFile>, licensekeyService: LicensekeyService);
    create(createJobDto: CreateJobDto): Promise<Job>;
    findAll(queryDto: ParsedQueryDto): Promise<MongoosePaginateJobDto>;
    remove(id: string): Promise<Job>;
    makeCompleted(jobId: string): Promise<Job>;
}
