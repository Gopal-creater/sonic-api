import { Module,forwardRef } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { LicensekeyModule } from '../licensekey/licensekey.module';

@Module({
  imports: [forwardRef(() => LicensekeyModule)],
  controllers: [UserController],
  providers: [UserService],
  exports:[UserService]
})
export class UserModule {}
