import { Module,forwardRef } from '@nestjs/common';
import { RadiostationService } from './services/radiostation.service';
import { RadiostationController } from './controllers/radiostation.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  RadioStationSchema,
  RadioStationSchemaName,
} from './schemas/radiostation.schema';
import { SonickeyModule } from '../sonickey/sonickey.module';
import { DetectionModule } from '../detection/detection.module';
import { RadiomonitorModule } from '../radiomonitor/radiomonitor.module';
@Module({
  imports: [
  MongooseModule.forFeature([
      { name: RadioStationSchemaName, schema: RadioStationSchema }
    ]),
    SonickeyModule,
    forwardRef(()=>RadiomonitorModule),
    DetectionModule
  ],
  controllers: [RadiostationController],
  providers: [
    RadiostationService
  ],
  exports:[RadiostationService]
})
export class RadiostationModule {}
