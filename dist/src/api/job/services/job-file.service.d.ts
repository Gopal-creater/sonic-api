import { AddKeyAndUpdateJobFileDto } from '../dto/update-job-file.dto';
import { JobService } from './job.service';
import { SonickeyService } from '../../sonickey/services/sonickey.service';
import { SonicKey } from '../../sonickey/schemas/sonickey.schema';
import { KeygenService } from '../../../shared/modules/keygen/keygen.service';
import { JobFile } from '../schemas/jobfile.schema';
import { Model } from 'mongoose';
import { MongoosePaginateJobFileDto } from '../dto/mongoosepaginate-jobfile.dto';
import { ParsedQueryDto } from '../../../shared/dtos/parsedquery.dto';
export declare class JobFileService {
    jobFileModel: Model<JobFile>;
    readonly jobService: JobService;
    readonly keygenService: KeygenService;
    readonly sonickeyService: SonickeyService;
    constructor(jobFileModel: Model<JobFile>, jobService: JobService, keygenService: KeygenService, sonickeyService: SonickeyService);
    findAll(queryDto: ParsedQueryDto): Promise<MongoosePaginateJobFileDto>;
    addKeyToDbAndUpdateJobFile(jobId: string, fileId: string, addKeyAndUpdateJobFileDto: AddKeyAndUpdateJobFileDto): Promise<{
        createdSonicKey: SonicKey;
        updatedJobFile: JobFile;
    }>;
}
