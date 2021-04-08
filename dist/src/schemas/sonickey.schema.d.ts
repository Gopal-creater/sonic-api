import { Document } from 'mongoose';
export declare class SonicKey extends Document {
    constructor(data?: Partial<SonicKey>);
    sonicKey: string;
    owner: string;
    job: string;
    licenseId: string;
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
export declare const SonicKeySchema: import("mongoose").Schema<SonicKey, import("mongoose").Model<any, any>, undefined>;
