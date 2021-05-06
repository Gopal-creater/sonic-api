import { Document, Schema as MogSchema } from 'mongoose';
export declare const SonicKeySchemaName = "SonicKey";
export declare class SonicKey extends Document {
    sonicKey: string;
    owner: string;
    job: any;
    license: string;
    status: boolean;
    encodingStrength: number;
    contentType?: string;
    contentDescription: string;
    contentCreatedDate: Date;
    contentDuration?: number;
    contentSize: number;
    contentFilePath: string;
    contentFileType: string;
    contentEncoding: string;
    contentSamplingFrequency: string;
    isrcCode?: string;
    iswcCode?: string;
    tuneCode?: string;
    contentName?: string;
    contentOwner?: string;
    contentValidation?: boolean;
    contentFileName: string;
    contentQuality: string;
    additionalMetadata: Map<string, any>;
}
export declare const SonicKeySchema: MogSchema<SonicKey, import("mongoose").Model<any, any>, undefined>;