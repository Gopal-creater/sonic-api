import { Module, forwardRef } from '@nestjs/common';
import { TrackService } from './track.service';
import { TrackController } from './controllers/track.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TrackSchemaName, TrackSchema } from './schemas/track.schema';
import { UserModule } from '../user/user.module';
import { S3FileUploadModule } from '../s3fileupload/s3fileupload.module';
import { FileHandlerService } from 'src/shared/services/file-handler.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: TrackSchemaName, schema: TrackSchema }]),
    forwardRef(() => UserModule),
    S3FileUploadModule,
  ],
  controllers: [TrackController],
  providers: [TrackService,FileHandlerService],
  exports: [TrackService],
})
export class TrackModule {}
