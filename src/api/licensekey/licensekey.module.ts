import { Module } from '@nestjs/common';
import { LicensekeyService } from './licensekey.service';
import { LicensekeyController } from './licensekey.controller';

@Module({
  controllers: [LicensekeyController],
  providers: [LicensekeyService]
})
export class LicensekeyModule {}
