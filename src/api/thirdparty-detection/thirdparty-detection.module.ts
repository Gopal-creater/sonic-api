import { Module } from '@nestjs/common';
import { ThirdpartyDetectionService } from './thirdparty-detection.service';
import { ThirdpartyDetectionController } from './thirdparty-detection.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ThirdpartyDetectionSchema,
  ThirdpartyDetectionSchemaName,
} from './schemas/thirdparty-detection.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ThirdpartyDetectionSchemaName,
        schema: ThirdpartyDetectionSchema,
      },
    ]),
  ],
  controllers: [ThirdpartyDetectionController],
  providers: [ThirdpartyDetectionService],
})
export class ThirdpartyDetectionModule {}
