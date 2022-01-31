import { Module, forwardRef } from '@nestjs/common';
import { LicensekeyService } from './services/licensekey.service';
import { LicensekeyController } from './controllers/licensekey.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  LicenseKeySchemaName,
  LicenseKeySchema,
} from './schemas/licensekey.schema';
import { KeygenModule } from '../../shared/modules/keygen/keygen.module';
import { UserModule } from '../user/user.module';
import { LicensekeyOwnerController } from './controllers/licensekey-owner.controller';
import { CompanyModule } from '../company/company.module';

@Module({
  imports: [
forwardRef(() => UserModule),
    KeygenModule,
    CompanyModule,
    MongooseModule.forFeature([
      {
        name: LicenseKeySchemaName,
        schema: LicenseKeySchema,
      },
    ]),
  ],
  controllers: [LicensekeyController,LicensekeyOwnerController],
  providers: [LicensekeyService],
  exports: [LicensekeyService],
})
export class LicensekeyModule {}
