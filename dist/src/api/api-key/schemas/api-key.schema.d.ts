import { Document, Schema as MogSchema } from 'mongoose';
export declare const ApiKeySchemaName = "ApiKey";
export declare class ApiKey extends Document {
    customer: string;
    groups: [string];
    validity?: Date;
    disabled?: boolean;
    type?: string;
    suspended?: boolean;
    metaData?: Map<string, any>;
}
export declare const ApiKeySchema: MogSchema<ApiKey, import("mongoose").Model<any, any>, undefined>;
