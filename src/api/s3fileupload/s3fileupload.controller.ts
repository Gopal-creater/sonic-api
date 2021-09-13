import { Controller, Get, Param } from '@nestjs/common';
import { S3FileUploadService } from './s3fileupload.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('S3 File Upload Controller')
@Controller('s3-file-uploads')
export class S3FileUploadController {
  constructor(private readonly s3FileUploadService: S3FileUploadService) {}

  @Get('/signed-url/:key')
  getSignedUrl(@Param('key') key: string) {
    return this.s3FileUploadService.getSignedUrl(key);
  }

  @Get(':key')
  async getFile(@Param('key') key: string) {
    const file = await this.s3FileUploadService.getFile(key);
    console.log("file",file)
    return "done"
  }

  // @Delete(':key')
  // remove(@Param('key') key: string) {
  //   return this.s3FileUploadService.deleteFile(key);
  // }
}
