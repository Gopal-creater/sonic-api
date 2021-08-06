import { Module } from '@nestjs/common';
import { LicensekeyService } from './services/licensekey.service';
import { LicensekeyController } from './controllers/licensekey.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  LicenseKeySchemaName,
  LicenseKeySchema,
} from './schemas/licensekey.schema';

@Module({
  imports: [
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
