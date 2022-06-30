import { Module } from '@nestjs/common';
import { ThirdpartyDetectionService } from './thirdparty-detection.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ThirdpartyDetection,
  ThirdpartyDetectionSchema,
} from './schemas/thirdparty-detection.schema';
import { ThirdpartyDetectionFromBinaryController } from './controllers/thirdparty-detection-from-binary.controller';
import { ApiKeyModule } from '../api-key/api-key.module';
import { SonickeyModule } from '../sonickey/sonickey.module';
import { DetectionModule } from '../detection/detection.module';
import { UserModule } from '../user/user.module';
import { CompanyModule } from '../company/company.module';

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
    CompanyModule
  ],
  controllers: [
    ThirdpartyDetectionFromBinaryController,
  ],
  providers: [ThirdpartyDetectionService],
})
export class ThirdpartyDetectionModule {}
