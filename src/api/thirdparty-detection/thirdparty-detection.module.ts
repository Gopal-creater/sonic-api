import { Module } from '@nestjs/common';
import { ThirdpartyDetectionService } from './thirdparty-detection.service';
import { ThirdpartyDetectionController } from './controllers/thirdparty-detection.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ThirdpartyDetection,
  ThirdpartyDetectionSchema,
  ThirdpartyDetectionSchemaName,
} from './schemas/thirdparty-detection.schema';
import { ThirdpartyDetectionFromBinaryController } from './controllers/thirdparty-detection-from-binary.controller';
import { ApiKeyModule } from '../api-key/api-key.module';
import { SonickeyModule } from '../sonickey/sonickey.module';
import { DetectionModule } from '../detection/detection.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
  MongooseModule.forFeature([
      {
        name: ThirdpartyDetection.name,
        schema: ThirdpartyDetectionSchema,
      },
    ]),
    ApiKeyModule,
    SonickeyModule,
    DetectionModule,
    UserModule,
  ],
  controllers: [
    // ThirdpartyDetectionController,
    ThirdpartyDetectionFromBinaryController,
  ],
  providers: [ThirdpartyDetectionService],
})
export class ThirdpartyDetectionModule {}
