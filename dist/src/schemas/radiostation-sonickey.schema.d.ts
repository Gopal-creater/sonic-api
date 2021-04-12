import { Document, Schema as MogSchema } from 'mongoose';
import { RadioStation } from './radiostation.schema';
import { SonicKey } from './sonickey.schema';
export declare const RadioStationSonicKeySchemaName = "RadioStationSonicKey";
export declare class RadioStationSonicKey extends Document {
    constructor(data?: Partial<RadioStationSonicKey>);
    radioStation: RadioStation;
    sonicKey: SonicKey;
    count: number;
    owner: string;
    metaData: Map<string, any>;
}
export declare const RadioStationSonicKeySchema: MogSchema<RadioStationSonicKey, import("mongoose").Model<any, any>, undefined>;
