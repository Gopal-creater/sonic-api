export declare class FileHandlerService {
    deleteFileAtPath(pathFromRoot: string): Promise<void>;
    deleteDirectoryAtPath(pathFromRoot: string): void;
    makeDirectoryAt(pathFromRoot: string): Promise<string>;
    listAllDirectoryInsideDirectory(directoryPath: string): Promise<string[]>;
    listFilesForDirectory(directoryPath: string): Promise<{
        files: string[];
        path: string;
    }>;
    fileExistsAtPath(path: string): Promise<boolean>;
    downloadFileFromPath(pathFromRoot: string): Promise<any>;
}
