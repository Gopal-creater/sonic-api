import { Document, Schema as MogSchema } from 'mongoose';
import { JobFile } from './jobfile.schema';
export declare const JobSchemaName = "Job";
export declare type JobDocument = Omit<Job, 'jobFiles'> & {
    jobFiles: string[];
} & Document;
export declare class Job extends Document {
    constructor(data?: Partial<Job>);
    name: string;
    owner: string;
    license: string;
    isComplete: boolean;
    jobFiles: JobFile[];
}
export declare const JobSchema: MogSchema<Job, import("mongoose").Model<any, any>, undefined>;
