import { Module } from '@nestjs/common';
import { RadioMonitorService } from './radiomonitor.service';
import { RadioMonitorController } from './controllers/radiomonitor.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  RadioMonitorSchema,
  RadioMonitorSchemaName,
} from './schemas/radiomonitor.schema';
import { RadiostationModule } from '../radiostation/radiostation.module';
import { RadioMonitorOwnerController } from './controllers/radiomonitor-owner.controller';
import { LicensekeyModule } from '../licensekey/licensekey.module';

@Module({
  imports: [
    LicensekeyModule,
    RadiostationModule,
    MongooseModule.forFeature([
      { name: RadioMonitorSchemaName, schema: RadioMonitorSchema },
    ]),
  ],
  controllers: [RadioMonitorController, RadioMonitorOwnerController],
  providers: [RadioMonitorService],
})
export class RadiomonitorModule {}
