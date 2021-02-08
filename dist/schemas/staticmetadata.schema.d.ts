export declare class StaticMetadata {
    constructor(data?: Partial<StaticMetadata>);
    encodingStrength?: number;
    contentType: string;
    contentCreatedDate?: Date;
    contentDuration: number;
    contentSize: number;
    contentFilePath: string;
    uniqueFileName?: string;
    originalFileName?: string;
    contentFileType: string;
    contentEncoding: string;
    contentSamplingFrequency: string;
    isrcCode?: string;
    iswcCode?: string;
    tuneCode?: string;
}
