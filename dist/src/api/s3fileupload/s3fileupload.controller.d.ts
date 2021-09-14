import { StreamableFile } from '@nestjs/common';
import { S3FileUploadService } from './s3fileupload.service';
export declare class S3FileUploadController {
    private readonly s3FileUploadService;
    constructor(s3FileUploadService: S3FileUploadService);
    getSignedUrl(key: string, userId: string): Promise<string>;
    getFile(key: string, userId: string): Promise<StreamableFile>;
}
