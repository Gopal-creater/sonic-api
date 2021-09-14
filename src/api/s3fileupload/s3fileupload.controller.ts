import { Controller, Get, Param, StreamableFile, UseGuards, ForbiddenException } from '@nestjs/common';
import { S3FileUploadService } from './s3fileupload.service';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../auth/decorators/user.decorator';

@ApiTags('S3 File Upload Controller')
@Controller('s3-file-uploads')
export class S3FileUploadController {
  constructor(private readonly s3FileUploadService: S3FileUploadService) {}

  @Get('/signed-url/:key')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get Signed Url for download' })
  getSignedUrl(@Param('key') key: string,@User('sub') userId: string,) {
      /* Checks for authenticated user in order to download the file */
      if (!key?.includes(userId)) {
        throw new ForbiddenException('You are not the owner of this file');
      }
    return this.s3FileUploadService.getSignedUrl(key);
  }

  @Get(':key')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Download file' })
  async getFile(@Param('key') key: string,@User('sub') userId: string,) {
       /* Checks for authenticated user in order to download the file */
       if (!key?.includes(userId)) {
        throw new ForbiddenException('You are not the owner of this file');
      }
    const file = await this.s3FileUploadService.getFile(key);
    return new StreamableFile(Buffer.from(file.Body))
  }

  // @Delete(':key')
  // remove(@Param('key') key: string) {
  //   return this.s3FileUploadService.deleteFile(key);
  // }
}
