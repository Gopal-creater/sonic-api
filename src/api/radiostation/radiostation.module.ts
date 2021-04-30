import { Module } from '@nestjs/common';
import { RadiostationService } from './services/radiostation.service';
import { RadiostationController } from './controllers/radiostation.controller';
import { RadiostationSonicKeysController } from './controllers/radiostation-sonickeys.controller';
import { RadiostationSonicKeysService } from './services/radiostation-sonickeys.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  RadioStationSchema,
  RadioStationSchemaName,
} from './schemas/radiostation.schema';
import { SonickeyModule } from '../sonickey/sonickey.module';
import {
  RadioStationSonicKeySchema,
  RadioStationSonicKeySchemaName,
} from './schemas/radiostation-sonickey.schema';
import {
  SonicKeySchema,
  SonicKeySchemaName,
} from '../sonickey/schemas/sonickey.schema';
import { RadioStationListener } from './listeners/radiostation.listener';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RadioStationSchemaName, schema: RadioStationSchema },
      {
        name: RadioStationSonicKeySchemaName,
        schema: RadioStationSonicKeySchema,
      },
      { name: SonicKeySchemaName, schema: SonicKeySchema },
    ]),
    SonickeyModule,
  ],
  controllers: [RadiostationController, RadiostationSonicKeysController],
  providers: [
    RadiostationService,
    RadiostationSonicKeysService,
    RadioStationListener,
  ],
})
export class RadiostationModule {}
