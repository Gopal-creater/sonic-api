import { Document, Schema as MogSchema } from 'mongoose';
import { SonicKey } from '../../../schemas/sonickey.schema';
export declare const ThirdpartyDetectionSchemaName = "ThirdpartyDetection";
export declare class ThirdpartyDetection extends Document {
    constructor(data?: Partial<ThirdpartyDetection>);
    customer: string;
    sonicKey: SonicKey;
    detectionTime: Date;
    metaData: Map<string, any>;
}
export declare const ThirdpartyDetectionSchema: MogSchema<ThirdpartyDetection, import("mongoose").Model<any, any>, undefined>;
