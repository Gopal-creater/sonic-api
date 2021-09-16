import { Document, Schema as MogSchema } from 'mongoose';
export declare const RadioMonitorSchemaName = "RadioMonitor";
export declare class RadioMonitor extends Document {
    radio: any;
    license: any;
    owner: string;
    startedAt: Date;
    stopAt: Date;
    isListeningStarted: boolean;
    isError: boolean;
    error: Map<string, any>;
    metaData: Map<string, any>;
}
export declare const RadioMonitorSchema: MogSchema<RadioMonitor, import("mongoose").Model<any, any>, undefined>;
