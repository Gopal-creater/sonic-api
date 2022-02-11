import { FileHandlerService } from './../../shared/services/file-handler.service';
import { forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppVersionSchema, AppVersionSchemaName } from './schemas/appversions.schema';
import { S3FileUploadModule } from '../s3fileupload/s3fileupload.module';
import { AppVersionService } from './appversions.service';
import { AppVersionController } from './appversions.controller';
import { Module, NestModule, MiddlewareConsumer,RequestMethod } from '@nestjs/common';
import { FileOperationService } from '../../shared/services/file-operation.service';
import {versionAndPlatform} from '../../shared/middlewares/checkVersionCodeAndPlatform.middleware'


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
export class AppVersionModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(versionAndPlatform)
      .forRoutes({ path: 'app-versions', method: RequestMethod.GET });
  }

}
