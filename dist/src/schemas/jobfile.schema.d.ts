import { Document, Schema as MogSchema } from 'mongoose';
import { Job } from './job.schema';
export declare const JobFileSchemaName = "JobFile";
export declare class JobFile extends Document {
    constructor(data?: Partial<JobFile>);
    sonicKey: string;
    isComplete: boolean;
    metaData: Map<string, any>;
    job: Job;
}
export declare const JobFileSchema: MogSchema<JobFile, import("mongoose").Model<any, any>, undefined>;
