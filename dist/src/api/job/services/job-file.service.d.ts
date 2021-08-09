import { UpdateJobFileDto, AddKeyAndUpdateJobFileDto } from '../dto/update-job-file.dto';
import { JobService } from './job.service';
import { SonickeyService } from '../../sonickey/services/sonickey.service';
import { SonicKey } from '../../sonickey/schemas/sonickey.schema';
import { JobFile } from '../schemas/jobfile.schema';
import { Model } from 'mongoose';
import { MongoosePaginateJobFileDto } from '../dto/mongoosepaginate-jobfile.dto';
import { ParsedQueryDto } from '../../../shared/dtos/parsedquery.dto';
import { LicensekeyService } from '../../licensekey/services/licensekey.service';
export declare class JobFileService {
    jobFileModel: Model<JobFile>;
    readonly jobService: JobService;
    readonly sonickeyService: SonickeyService;
    readonly licensekeyService: LicensekeyService;
    constructor(jobFileModel: Model<JobFile>, jobService: JobService, sonickeyService: SonickeyService, licensekeyService: LicensekeyService);
    findAll(queryDto: ParsedQueryDto): Promise<MongoosePaginateJobFileDto>;
    addKeyToDbAndUpdateJobFile(jobId: string, fileId: string, addKeyAndUpdateJobFileDto: AddKeyAndUpdateJobFileDto): Promise<{
        createdSonicKey: SonicKey;
        updatedJobFile: JobFile;
    }>;
    updateJobFile(fileId: string, updateJobFileDto: UpdateJobFileDto): Promise<JobFile>;
}
