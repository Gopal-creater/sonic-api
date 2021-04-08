import { GlobalAwsService } from 'src/shared/modules/global-aws/global-aws.service';
export declare class S3Service {
    private readonly globalAwsService;
    private s3;
    private BUCKET;
    private upload;
    constructor(globalAwsService: GlobalAwsService);
    fileupload(req: any, res: any): Promise<any>;
    getFiles(): Promise<FileUpload[] | string>;
    deleteFile(file: FileUpload): Promise<unknown>;
}
export declare class FileUpload {
    name: string;
    url?: string;
    constructor(name: string, url?: string);
    result: any[];
}
