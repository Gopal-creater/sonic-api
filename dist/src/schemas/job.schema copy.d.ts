import { Document, Schema as MogSchema } from 'mongoose';
export declare const JobSchemaName = "Job";
export declare class Job extends Document {
    name: string;
    owner: string;
    license: string;
    isComplete: boolean;
    jobFiles: any[];
}
export declare const JobSchema: MogSchema<Job, import("mongoose").Model<any, any>, undefined>;
