import { Document, Schema as MogSchema } from 'mongoose';
export declare const RadioStationSonicKeySchemaName = "RadioStationSonicKey";
export declare class DetectedDetail {
    detectedAt: Date;
}
export declare const DetectedDetailSchema: MogSchema<Document<DetectedDetail, {}>, import("mongoose").Model<any, any>, undefined>;
export declare class RadioStationSonicKey extends Document {
    radioStation: any;
    sonicKey: any;
    owner: string;
    sonicKeyOwner: string;
    count: number;
    detectedDetails: [DetectedDetail];
    metaData?: Map<string, any>;
}
export declare const RadioStationSonicKeySchema: MogSchema<RadioStationSonicKey, import("mongoose").Model<any, any>, undefined>;
