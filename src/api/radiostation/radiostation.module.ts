import { Module, forwardRef } from '@nestjs/common';
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
import { AuthModule } from '../auth/auth.module';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RadioStationSchemaName, schema: RadioStationSchema },
    ]),
    SonickeyModule,
    forwardRef(() => RadiomonitorModule),
    DetectionModule,
    forwardRef(() => AuthModule),
  ],
  controllers: [RadiostationController],
  providers: [RadiostationService],
  exports: [RadiostationService],
})
export class RadiostationModule {}
