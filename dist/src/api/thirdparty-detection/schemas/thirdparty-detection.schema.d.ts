import { Document, Schema as MogSchema } from 'mongoose';
export declare const ThirdpartyDetectionSchemaName = "ThirdpartyDetection";
export declare class ThirdpartyDetection extends Document {
    customer: string;
    sonicKey: string;
    detectionTime: Date;
    metaData: Map<string, any>;
}
export declare const ThirdpartyDetectionSchema: MogSchema<ThirdpartyDetection, import("mongoose").Model<any, any>, undefined>;
