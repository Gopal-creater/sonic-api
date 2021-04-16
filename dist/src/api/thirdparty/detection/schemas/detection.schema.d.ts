import { Document, Schema as MogSchema } from 'mongoose';
import { Job } from './job.schema';
import { SonicKey } from './sonickey.schema';
export declare const ThirdPartyDetectionSchemaName = "ThirdPartyDetection";
export declare class ThirdPartyDetection extends Document {
    constructor(data?: Partial<ThirdPartyDetection>);
    sonicKeyToBe: string;
    sonicKey: SonicKey;
    isComplete: boolean;
    metaData: Map<string, any>;
    job: Job;
}
export declare const ThirdPartyDetectionSchema: MogSchema<ThirdPartyDetection, import("mongoose").Model<any, any>, undefined>;
