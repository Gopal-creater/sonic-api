import { Module } from '@nestjs/common';
import { S3FileUploadService } from './s3fileupload.service';
import { S3FileUploadController } from './s3fileupload.controller';

@Module({
  controllers: [S3FileUploadController],
  providers: [S3FileUploadService],
  exports:[S3FileUploadService]
})
export class S3FileUploadModule {}
