import { Module } from '@nestjs/common';
import { RadiostationService } from './services/radiostation.service';
import { RadiostationController } from './controllers/radiostation.controller';
import { RadioStationRepository } from '../../repositories/radiostation.repository';
import { RadiostationSonicKeysController } from './controllers/radiostation-sonickeys.controller';
import { RadiostationSonicKeysService } from './services/radiostation-sonickeys.service';
import { RadioStationSonicKeyRepository } from '../../repositories/radiostationSonickey.repository';
import { MongooseModule } from '@nestjs/mongoose';
import {
  RadioStation,
  RadioStationSchema,
} from '../../schemas/radiostation.schema';
import { RadioStationSonicKey,RadioStationSonicKeySchema } from '../../schemas/radiostation-sonickey.schema';
import { SonicKey,SonicKeySchema } from '../../schemas/sonickey.schema';
@Module({
  imports: [
MongooseModule.forFeature([
      { name: RadioStation.name, schema: RadioStationSchema },
      { name: RadioStationSonicKey.name, schema: RadioStationSonicKeySchema },
      { name: SonicKey.name, schema: SonicKeySchema }
    ]),
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
