import { GlobalAwsService } from '../../shared/modules/global-aws/global-aws.service';
import * as AWS from 'aws-sdk';
import { S3ACL } from 'src/constants/Enums';
export declare class S3FileUploadService {
    private readonly globalAwsService;
    private s3;
    private s3ClientV2;
    private bucketName;
    constructor(globalAwsService: GlobalAwsService);
    upload(file: any, destinationFolder?: string, acl?: S3ACL): Promise<AWS.S3.ManagedUpload.SendData>;
    uploadFromPath(filePath: string, destinationFolder?: string, acl?: S3ACL): Promise<AWS.S3.ManagedUpload.SendData>;
    uploadS3(file: any, bucket: string, name: string, acl: S3ACL): Promise<AWS.S3.ManagedUpload.SendData>;
    getFile(key: string): Promise<import("aws-sdk/lib/request").PromiseResult<AWS.S3.GetObjectOutput, AWS.AWSError>>;
    getFiles(): Promise<import("aws-sdk/lib/request").PromiseResult<AWS.S3.ListObjectsV2Output, AWS.AWSError>>;
    getSignedUrl(key: string, expiry?: number): Promise<string>;
    deleteFile(key: string): Promise<import("aws-sdk/lib/request").PromiseResult<AWS.S3.DeleteObjectOutput, AWS.AWSError>>;
}
