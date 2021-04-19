import { Document, Schema as MogSchema } from 'mongoose';
export declare const RadioStationSchemaName = "RadioStation";
export declare class Credential {
    username: string;
    password: string;
}
export declare class RadioStation extends Document {
    name: string;
    streamingUrl: string;
    website: string;
    logo: string;
    credential: Credential;
    owner: string;
    startedAt: Date;
    stopAt: Date;
    isStreamStarted: boolean;
    notes: string;
    metaData: Map<string, any>;
}
export declare const RadioStationSchema: MogSchema<RadioStation, import("mongoose").Model<any, any>, undefined>;
