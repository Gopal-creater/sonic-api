export declare class SonicKey {
    constructor(data?: Partial<SonicKey>);
    sonicKey?: string;
    owner: string;
    job: string;
    licenseId?: string;
    createdAt: Date;
    status?: boolean;
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
    contentName?: string;
    contentOwner?: string;
    contentValidation?: boolean;
    contentFileName: string;
    contentQuality: string;
    additionalMetadata: {
        [key: string]: any;
    };
}
