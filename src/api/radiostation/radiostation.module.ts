import { Module } from '@nestjs/common';
import { RadiostationService } from './services/radiostation.service';
import { RadiostationController } from './controllers/radiostation.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  RadioStationSchema,
  RadioStationSchemaName,
} from './schemas/radiostation.schema';
import { SonickeyModule } from '../sonickey/sonickey.module';
import { DetectionModule } from '../detection/detection.module';
import { RadioStationListener } from './listeners/radiostation.listener';
@Module({
  imports: [
  MongooseModule.forFeature([
      { name: RadioStationSchemaName, schema: RadioStationSchema }
    ]),
    SonickeyModule,
    DetectionModule
  ],
  controllers: [RadiostationController],
  providers: [
    RadiostationService,
    RadioStationListener,
  ],
})
export class RadiostationModule {}
