import { FileHandlerService } from './../../shared/services/file-handler.service';
import { Module, forwardRef } from '@nestjs/common';
import { SonickeyController } from './controllers/sonickey.controller';
import { SonickeyService } from './services/sonickey.service';
import { MongooseModule } from '@nestjs/mongoose';
import { SonicKeySchema, SonicKeySchemaName } from './schemas/sonickey.schema';
import { FileOperationService } from '../../shared/services/file-operation.service';
import { SonickeyGuestController } from './controllers/sonickey.guest.controller';
import { SonickeyBinaryController } from './controllers/sonickey.binary.controller';
import { ApiKeyModule } from '../api-key/api-key.module';
import { LicensekeyModule } from '../licensekey/licensekey.module';
import { S3FileUploadModule } from '../s3fileupload/s3fileupload.module';
import { DetectionModule } from '../detection/detection.module';
import { SonickeyThirdPartyController } from './controllers/sonickey.thirdparty.controller';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { BullModule } from '@nestjs/bull';
import { SonicKeyProcessor } from './processors/sonickey.processor';
@Module({
  imports: [
    BullModule.registerQueue({
      name: 'sonickey',
    }),
    forwardRef(() => ApiKeyModule),
    LicensekeyModule,
    forwardRef(() => UserModule),
    forwardRef(() => AuthModule),
    forwardRef(() => DetectionModule),
    S3FileUploadModule,
    MongooseModule.forFeature([
      { name: SonicKeySchemaName, schema: SonicKeySchema },
    ]),
  ],
  controllers: [
    SonickeyController,
    SonickeyGuestController,
    SonickeyBinaryController,
    SonickeyThirdPartyController,
  ],
  providers: [
    SonickeyService,
    FileOperationService,
    FileHandlerService,
    SonicKeyProcessor,
  ],
  exports: [SonickeyService],
})
export class SonickeyModule {}
