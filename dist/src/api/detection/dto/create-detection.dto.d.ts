export declare class CreateDetectionDto {
    radioStation: string;
    sonicKey: string;
    apiKey: string;
    licenseKey: string;
    owner: string;
    channel: string;
    channelUuid: string;
    detectedAt: Date;
    metaData?: Map<string, any>;
}
export declare class CreateDetectionFromBinaryDto {
    sonicKey: string;
    detectedAt: Date;
    metaData: Map<string, any>;
}
export declare class CreateDetectionFromHardwareDto {
    sonicKey: string;
    detectedAt: Date;
    metaData: Map<string, any>;
}
