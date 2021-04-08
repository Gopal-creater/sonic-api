import { JobRepository } from '../../../repositories/job.repository';
import { UpdateJobFileDto, AddKeyAndUpdateJobFileDto } from '../dto/update-job-file.dto';
import { JobService } from './job.service';
import { SonickeyService } from '../../sonickey/sonickey.service';
import { SonicKey } from '../../../schemas/sonickey.schema';
import { KeygenService } from '../../../shared/modules/keygen/keygen.service';
import { AddFilesDto } from '../dto/add-files.dto';
export declare class JobFileService {
    readonly jobRepository: JobRepository;
    readonly jobService: JobService;
    readonly keygenService: KeygenService;
    readonly sonickeyService: SonickeyService;
    constructor(jobRepository: JobRepository, jobService: JobService, keygenService: KeygenService, sonickeyService: SonickeyService);
    updateJobFile(jobId: string, fileId: string, updateJobFileDto: UpdateJobFileDto): Promise<{
        fileDetail: {
            [x: string]: any;
        } & {
            [key: string]: any;
        } & {
            fileId: string;
        };
        updatedJob: import("../../../schemas/job.schema").Job;
    }>;
    addKeyToDbAndUpdateJobFile(jobId: string, fileId: string, addKeyAndUpdateJobFileDto: AddKeyAndUpdateJobFileDto): Promise<{
        createdSonicKey: SonicKey;
        fileDetail: {
            [x: string]: any;
        } & {
            [key: string]: any;
        } & {
            fileId: string;
        };
        updatedJob: import("../../../schemas/job.schema").Job;
    }>;
    addFilesToJob(jobId: string, addFilesDto: AddFilesDto): Promise<import("../../../schemas/job.schema").Job>;
    deleteFileFromJob(jobId: string, fileId: string): Promise<import("../../../schemas/job.schema").Job>;
}
