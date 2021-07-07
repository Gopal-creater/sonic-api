import { Module } from '@nestjs/common';
import { DetectionService } from './detection.service';
import { DetectionController } from './controllers/detection.controller';
import { DetectionOwnerController } from './controllers/detection.owner.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Detection,
  DetectionSchema
} from './schemas/detection.schema';
import { ApiKeyModule } from '../api-key/api-key.module';
import { SonickeyModule } from '../sonickey/sonickey.module';

@Module({
  imports: [
  MongooseModule.forFeature([
        {
          name: Detection.name,
          schema: DetectionSchema,
        },
      ]),
      ApiKeyModule,
      SonickeyModule
    ],
  controllers: [DetectionController,DetectionOwnerController],
  providers: [DetectionService],
  exports:[DetectionService]
})
export class DetectionModule {}
