import { GlobalAwsService } from 'src/shared/modules/global-aws/global-aws.service';
import { Injectable, Req, Res } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import * as multer from 'multer';
import * as multerS3 from 'multer-s3';

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  // region: process.env.AWS_REGION,
});

@Injectable()
export class S3Service {
  private s3: AWS.S3;
  private BUCKET = process.env.AWS_S3_BUCKET_NAME;
  private upload: any;
  constructor(private readonly globalAwsService: GlobalAwsService) {
    this.s3 = this.globalAwsService.getS3();
    this.upload = multer({
      storage: multerS3({
        s3: this.s3,
        bucket: this.BUCKET,
        acl: 'public-read',
        key: function(request, file, cb) {
          cb(null, `${Date.now().toString()} - ${file.originalname}`);
        },
      }),
    }).array('upload', 100);
  }

  //Method to upload file in s3
  async fileupload(@Req() req, @Res() res) {
    try {
      this.upload(req, res, function(error) {
        if (error) {
          console.log(error);
          return res.status(404).json(`Failed to upload image file: ${error}`);
        }
        return res.status(201).json(req.files[0].location);
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json(`Failed to upload image file: ${error}`);
    }
  }

  //Method to get all the files in S3 bucket
  public getFiles(): Promise<FileUpload[] | string> {
    const params = {
      Bucket: this.BUCKET,
    };

    return new Promise((resolve, reject) => {
      s3.listObjectsV2(params, function(err, data) {
        if (err) {
          console.log('There was an error getting your files: ' + err);
          reject('There was an error getting your files');
        }
        console.log('Successfully get files.', data);

        const fileDetails = data.Contents;
        const files = fileDetails.map((file, index) => {
          return new FileUpload(
            file.Key,
            'https://s3.amazonaws.com/' + params.Bucket + '/' + file.Key,
          );
        });
        resolve(files);
      });
    });
  }

  //Method to delete file from S3 bucket
  async deleteFile(file: FileUpload) {
    const params = {
      Bucket: this.BUCKET,
      Key: file.name,
    };
    return new Promise((resolve, reject) => {
      s3.deleteObject(params, function(err, data) {
        if (err) {
          reject(err);
        }
        resolve(data);
      });
    });
  }
}

//A class to pass name and url
export class FileUpload {
  name: string;
  url?: string;

  constructor(name: string, url?: string) {
    this.name = name;
    this.url = url;
  }
  result: any[];
}
