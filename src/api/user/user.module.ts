import { Module, forwardRef } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { LicensekeyModule } from '../licensekey/licensekey.module';
import { RadiomonitorModule } from '../radiomonitor/radiomonitor.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchemaName, UserSchema } from './schemas/user.db.schema';
import { UserGroupService } from './services/user-group.service';
import { UserCompanyService } from './services/user-company.service';
import { GroupModule } from '../group/group.module';
import { CompanyModule } from '../company/company.module';
import { UserGroupController } from './controllers/user-group.controller';
import { UserCompanyController } from './controllers/user-company.controller';
import { AuthModule } from '../auth/auth.module';
import { ApiKeyModule } from '../api-key/api-key.module';

@Module({
  imports: [
    forwardRef(() => LicensekeyModule),
    forwardRef(() => RadiomonitorModule),
    MongooseModule.forFeature([{ name: UserSchemaName, schema: UserSchema }]),
    GroupModule,
    forwardRef(() => ApiKeyModule),
    CompanyModule,
    forwardRef(() => AuthModule),
  ],
  controllers: [UserController, UserGroupController, UserCompanyController],
  providers: [UserGroupService, UserCompanyService, UserService],
  exports: [UserGroupService, UserCompanyService, UserService],
})
export class UserModule {}
