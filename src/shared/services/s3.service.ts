import { GlobalAwsService } from '../../shared/modules/global-aws/global-aws.service';
import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { IUploadedFile } from '../interfaces/UploadedFile.interface';

// https://dev.to/vjnvisakh/uploading-to-s3-using-nestjs-4037
// https://flaviocopes.com/node-upload-files-s3/
@Injectable()
export class S3Service {
  private s3: AWS.S3;
  private BUCKET: string;
  constructor(private readonly globalAwsService: GlobalAwsService) {
    this.s3 = this.globalAwsService.getS3();
    this.BUCKET = process.env.AWS_S3_BUCKET_NAME;
  }

  async upload(file:any) {
    const { originalname } = file;
    const bucketS3 = this.BUCKET;
    return this.uploadS3(file.buffer, bucketS3, originalname);
  }

  //Method to upload file S3 bucket
  async uploadS3(file, bucket, name) {
    const params: AWS.S3.PutObjectRequest = {
      Bucket: bucket,
      Key: String(name),
      Body: file,
    };
    return this.s3.upload(params).promise();
  }

  //Method to get all the files in S3 bucket
  public getFiles() {
    const params: AWS.S3.ListObjectsV2Request = {
      Bucket: this.BUCKET,
    };
    return this.s3.listObjectsV2(params).promise();
  }

  //Method to delete file from S3 bucket
  async deleteFile(key: string) {
    const params: AWS.S3.DeleteObjectRequest = {
      Bucket: this.BUCKET,
      Key: key,
    };
    return this.s3.deleteObject(params).promise();
  }
}
