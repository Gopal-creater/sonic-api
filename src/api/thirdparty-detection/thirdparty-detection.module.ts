import { Module } from '@nestjs/common';
import { ThirdpartyDetectionService } from './thirdparty-detection.service';
import { ThirdpartyDetectionController } from './thirdparty-detection.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ThirdpartyDetection ,ThirdpartyDetectionSchema} from './schemas/thirdparty-detection.schema';

@Module({
  imports: [

  MongooseModule.forFeature([
      { name: ThirdpartyDetection.name, schema: ThirdpartyDetectionSchema }
    ])
  ],
  controllers: [ThirdpartyDetectionController],
  providers: [ThirdpartyDetectionService]
})
export class ThirdpartyDetectionModule {}
