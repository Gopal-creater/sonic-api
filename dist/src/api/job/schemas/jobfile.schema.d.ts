import { Document, Schema as MogSchema } from 'mongoose';
export declare const JobFileSchemaName = "JobFile";
export declare class JobFile extends Document {
    sonicKeyToBe: string;
    sonicKey: string;
    isComplete: boolean;
    metaData: Map<string, any>;
    job: any;
}
export declare const JobFileSchema: MogSchema<JobFile, import("mongoose").Model<any, any>, undefined>;
