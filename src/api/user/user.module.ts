import { KeygenModule } from './../../shared/modules/keygen/keygen.module';
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { LicensekeyModule } from '../licensekey/licensekey.module';

@Module({
  imports: [KeygenModule, LicensekeyModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
