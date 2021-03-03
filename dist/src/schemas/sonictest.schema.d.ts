export declare class SonicTest {
    constructor(data?: Partial<SonicTest>);
    sonicKey?: string;
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
