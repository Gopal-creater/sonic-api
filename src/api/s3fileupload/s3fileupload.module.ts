import { Module,forwardRef } from '@nestjs/common';
import { S3FileUploadService } from './s3fileupload.service';
import { S3FileUploadController } from './s3fileupload.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [forwardRef(()=>AuthModule)],
  controllers: [S3FileUploadController],
  providers: [S3FileUploadService],
  exports: [S3FileUploadService],
})
export class S3FileUploadModule {}
