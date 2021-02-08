export declare class FileOperationService {
    encodeFile(sonicEncodeCmd: string, outFilePath: string): Promise<unknown>;
    decodeFile(sonicDecodeCmd: string, logFilePath: string): Promise<unknown>;
}
