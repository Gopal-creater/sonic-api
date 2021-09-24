import { GlobalAwsService } from '../../shared/modules/global-aws/global-aws.service';
import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import * as fs from 'fs';
import * as uniqid from 'uniqid';
import { S3ACL } from 'src/constants/Enums';
import { extractFileName } from 'src/shared/utils';

// https://dev.to/vjnvisakh/uploading-to-s3-using-nestjs-4037
// https://flaviocopes.com/node-upload-files-s3/
@Injectable()
export class S3FileUploadService {
  private s3: AWS.S3;
  private s3ClientV2: S3Client;
  private bucketName: string;
  constructor(private readonly globalAwsService: GlobalAwsService) {
    this.s3 = this.globalAwsService.getS3();
    this.s3ClientV2 = this.globalAwsService.getS3ClientV2();
    this.bucketName = process.env.AWS_S3_BUCKET_NAME;
  }

  async upload(file: any, destinationFolder?: string, acl = S3ACL.PRIVATE) {
    const { originalname } = file;
    const bucketS3Destination = destinationFolder
      ? `${this.bucketName}/${destinationFolder}`
      : this.bucketName;
    return this.uploadS3(file.buffer, bucketS3Destination, originalname, acl);
  }

  async uploadFromPath(
    filePath: string,
    destinationFolder?: string,
    acl = S3ACL.PRIVATE,
  ) {
    const fileContect = fs.createReadStream(filePath);
    const fileName = extractFileName(filePath);
    const bucketS3Destination = destinationFolder
      ? `${this.bucketName}/${destinationFolder}`
      : this.bucketName;
    return this.uploadS3(fileContect, bucketS3Destination, fileName, acl);
  }

  //Method to upload file S3 bucket
  async uploadS3(file: any, bucket: string, name: string, acl: S3ACL) {
    const params: AWS.S3.PutObjectRequest = {
      Bucket: bucket,
      Key: `${uniqid()}-${name}`,
      Body: file,
      ACL: acl,
    };
    return this.s3.upload(params).promise();
  }

  //Method to get single file from S3 bucket
  public getFile(key: string) {
    // const getObjectCommand = new GetObjectCommand({
    //   Bucket: this.bucketName,
    //   Key:key
    // })
    const params: AWS.S3.GetObjectRequest = {
      Bucket: this.bucketName,
      Key: key,
    };
    // return this.s3ClientV2.send(getObjectCommand)
    return this.s3.getObject(params).promise();
  }

  //Method to get all the files in S3 bucket
  public getFiles() {
    const params: AWS.S3.ListObjectsV2Request = {
      Bucket: this.bucketName,
    };
    return this.s3.listObjectsV2(params).promise();
  }

  //Method to get all the files in S3 bucket, expiry in second default: 60sec
  public getSignedUrl(key: string, expiry: number = 60 * 1) {
    const params = {
      Bucket: this.bucketName,
      Key: key,
      Expires: expiry,
    };
    return this.s3.getSignedUrlPromise('getObject', params);
  }

  //Method to delete file from S3 bucket
  async deleteFile(key: string) {
    const params: AWS.S3.DeleteObjectRequest = {
      Bucket: this.bucketName,
      Key: key,
    };
    return this.s3.deleteObject(params).promise();
  }
}