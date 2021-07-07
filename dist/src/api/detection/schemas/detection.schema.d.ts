import { Document, Schema as MogSchema } from 'mongoose';
export declare const DetectionSchemaName = "Detection";
export declare class Detection extends Document {
    radioStation: any;
    sonicKey: any;
    apiKey: string;
    licenseKey: string;
    owner: string;
    sonicKeyOwnerId: string;
    sonicKeyOwnerName: string;
    channel: string;
    channelUuid: string;
    detectedAt: Date;
    metaData?: Map<string, any>;
}
export declare const DetectionSchema: MogSchema<Detection, import("mongoose").Model<any, any>, undefined>;
