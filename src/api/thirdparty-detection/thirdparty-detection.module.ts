import { Module } from '@nestjs/common';
import { ThirdpartyDetectionService } from './thirdparty-detection.service';
import { ThirdpartyDetectionController } from './controllers/thirdparty-detection.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ThirdpartyDetectionSchema,
  ThirdpartyDetectionSchemaName,
} from './schemas/thirdparty-detection.schema';
import { ThirdpartyDetectionFromBinaryController } from './controllers/thirdparty-detection-from-binary.controller';
import { ApiKeyModule } from '../api-key/api-key.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ThirdpartyDetectionSchemaName,
        schema: ThirdpartyDetectionSchema,
      },
    ]),
    ApiKeyModule,
  ],
  controllers: [
    ThirdpartyDetectionController,
    ThirdpartyDetectionFromBinaryController,
  ],
  providers: [ThirdpartyDetectionService],
})
export class ThirdpartyDetectionModule {}
