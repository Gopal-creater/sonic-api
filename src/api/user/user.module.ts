import { Module, forwardRef } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { LicensekeyModule } from '../licensekey/licensekey.module';
import { RadiomonitorModule } from '../radiomonitor/radiomonitor.module';

@Module({
  imports: [forwardRef(() => LicensekeyModule), forwardRef(() => RadiomonitorModule)],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
