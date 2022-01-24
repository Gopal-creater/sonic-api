import { FileHandlerService } from './../../shared/services/file-handler.service';
import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppVersionSchema, AppVersionSchemaName } from './schemas/appversions.schema';
import { S3FileUploadModule } from '../s3fileupload/s3fileupload.module';
import { AppVersionService } from './appversions.service';
import { AppVersionController } from './appversions.controller';
import { FileOperationService } from '../../shared/services/file-operation.service';


@Module({
  imports: [
    S3FileUploadModule,
    MongooseModule.forFeature([
      { name: AppVersionSchemaName, schema: AppVersionSchema },
    ]),
  ],
  controllers: [
    AppVersionController
  ],
  providers: [AppVersionService, FileOperationService, FileHandlerService],
  exports: [AppVersionService],
})
export class AppVersionModule {}
