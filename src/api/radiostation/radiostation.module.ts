import { Module } from '@nestjs/common';
import { RadiostationService } from './services/radiostation.service';
import { RadiostationController } from './controllers/radiostation.controller';
import { RadioStationRepository } from '../../repositories/radiostation.repository';
import { RadiostationSonicKeysController } from './controllers/radiostation-sonickeys.controller';
import { RadiostationSonicKeysService } from './services/radiostation-sonickeys.service';
import { RadioStationSonicKeyRepository } from '../../repositories/radiostationSonickey.repository';
import { MongooseModule } from '@nestjs/mongoose';
import {
  RadioStationSchema,
  RadioStationSchemaName
} from '../../schemas/radiostation.schema';
import { SonickeyModule } from '../sonickey/sonickey.module';
import { RadioStationSonicKeySchema,RadioStationSonicKeySchemaName } from '../../schemas/radiostation-sonickey.schema';
import { SonicKeySchema,SonicKeySchemaName } from '../../schemas/sonickey.schema';
@Module({
  imports: [
MongooseModule.forFeature([
      { name: RadioStationSchemaName, schema: RadioStationSchema },
      { name: RadioStationSonicKeySchemaName, schema: RadioStationSonicKeySchema },
      { name: SonicKeySchemaName, schema: SonicKeySchema }
    ]),
    SonickeyModule
  ],
  controllers: [RadiostationController, RadiostationSonicKeysController],
  providers: [
    RadiostationService,
    RadiostationSonicKeysService,
    RadioStationRepository,
    RadioStationSonicKeyRepository,
  ],
})
export class RadiostationModule {}
