import { Document, Schema as MogSchema } from 'mongoose';
import { Job } from './job.schema';
import { SonicKey } from './sonickey.schema';
export declare const JobFileSchemaName = "JobFile";
export declare class JobFile extends Document {
    sonicKeyToBe: string;
    sonicKey: SonicKey;
    isComplete: boolean;
    metaData: Map<string, any>;
    job: Job;
}
export declare const JobFileSchema: MogSchema<JobFile, import("mongoose").Model<any, any>, undefined>;
