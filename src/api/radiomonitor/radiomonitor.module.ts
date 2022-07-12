import { Module,forwardRef } from '@nestjs/common';
import { RadioMonitorService } from './radiomonitor.service';
import { RadioMonitorController } from './controllers/radiomonitor.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  RadioMonitorSchema,
  RadioMonitorSchemaName,
} from './schemas/radiomonitor.schema';
import { RadiostationModule } from '../radiostation/radiostation.module';
import { LicensekeyModule } from '../licensekey/licensekey.module';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
@Module({
  imports: [
LicensekeyModule,
    forwardRef(()=>RadiostationModule),
    MongooseModule.forFeature([
      { name: RadioMonitorSchemaName, schema: RadioMonitorSchema },
    ]),
    forwardRef(()=>AuthModule),
    forwardRef(() => UserModule)
  ],
  controllers: [RadioMonitorController],
  providers: [RadioMonitorService],
  exports:[RadioMonitorService]
})
export class RadiomonitorModule {}
