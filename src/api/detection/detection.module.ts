import { Module, forwardRef } from '@nestjs/common';
import { DetectionService } from './detection.service';
import { DetectionController } from './controllers/detection.controller';
import { DetectionOwnerController } from './controllers/detection.owner.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Detection, DetectionSchema } from './schemas/detection.schema';
import { ApiKeyModule } from '../api-key/api-key.module';
import { SonickeyModule } from '../sonickey/sonickey.module';
import { UserModule } from '../user/user.module';
import { DetectionThirdPartyController } from './controllers/detection.thirdparty.controller';
import { AuthModule } from '../auth/auth.module';
import { FileHandlerService } from '../../shared/services/file-handler.service';
import { CompanyModule } from '../company/company.module';
import { RadiostationModule } from '../radiostation/radiostation.module';

@Module({
  imports: [
MongooseModule.forFeature([
      {
        name: Detection.name,
        schema: DetectionSchema,
      },
    ]),
    forwardRef(() => ApiKeyModule),
    forwardRef(() => UserModule),
    forwardRef(() => CompanyModule),
    forwardRef(() => AuthModule),
    forwardRef(() => SonickeyModule),
    forwardRef(() => RadiostationModule)
  ],
  controllers: [
    DetectionController,
    DetectionOwnerController,
    DetectionThirdPartyController,
  ],
  providers: [DetectionService, FileHandlerService],
  exports: [DetectionService],
})
export class DetectionModule {}
