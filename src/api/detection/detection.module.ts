import { Module,forwardRef } from '@nestjs/common';
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
import { UserModule } from '../user/user.module';
import { DetectionThirdPartyController } from './controllers/detection.thirdparty.controller';

@Module({
  imports: [
MongooseModule.forFeature([
        {
          name: Detection.name,
          schema: DetectionSchema,
        },
      ]),
      ApiKeyModule,
      UserModule,
      forwardRef(()=>SonickeyModule)
    ],
  controllers: [DetectionController,DetectionOwnerController,DetectionThirdPartyController],
  providers: [DetectionService],
  exports:[DetectionService]
})
export class DetectionModule {}
