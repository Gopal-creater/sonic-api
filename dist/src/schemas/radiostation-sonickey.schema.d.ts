import { Document, Schema as MogSchema } from 'mongoose';
export declare const RadioStationSonicKeySchemaName = "RadioStationSonicKey";
export declare class RadioStationSonicKey extends Document {
    radioStation: any;
    sonicKey: any;
    count: number;
    owner: string;
    metaData: Map<string, any>;
}
export declare const RadioStationSonicKeySchema: MogSchema<RadioStationSonicKey, import("mongoose").Model<any, any>, undefined>;
