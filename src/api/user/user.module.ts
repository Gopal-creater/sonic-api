import { Module, forwardRef } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { LicensekeyModule } from '../licensekey/licensekey.module';
import { RadiomonitorModule } from '../radiomonitor/radiomonitor.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchemaName, UserSchema } from './schemas/user.db.schema';

@Module({
  imports: [
    forwardRef(() => LicensekeyModule),
    forwardRef(() => RadiomonitorModule),
    MongooseModule.forFeature([{ name: UserSchemaName, schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
