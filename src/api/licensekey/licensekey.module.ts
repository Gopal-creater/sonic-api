import { Module } from '@nestjs/common';
import { LicensekeyService } from './services/licensekey.service';
import { LicensekeyController } from './controllers/licensekey.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  LicenseKeySchemaName,
  LicenseKeySchema,
} from './schemas/licensekey.schema';
import { KeygenModule } from '../../shared/modules/keygen/keygen.module';

@Module({
  imports: [
  KeygenModule,
    MongooseModule.forFeature([
      {
        name: LicenseKeySchemaName,
        schema: LicenseKeySchema,
      },
    ]),
  ],
  controllers: [LicensekeyController],
  providers: [LicensekeyService],
  exports: [LicensekeyService],
})
export class LicensekeyModule {}
