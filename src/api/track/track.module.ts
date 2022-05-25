import { Module, forwardRef } from '@nestjs/common';
import { TrackService } from './track.service';
import { TrackController } from './controllers/track.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TrackSchemaName, TrackSchema } from './schemas/track.schema';
import { UserModule } from '../user/user.module';
import { S3FileUploadModule } from '../s3fileupload/s3fileupload.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: TrackSchemaName, schema: TrackSchema }]),
    forwardRef(() => UserModule),
    S3FileUploadModule,
  ],
  controllers: [TrackController],
  providers: [TrackService],
  exports: [TrackService],
})
export class TrackModule {}
