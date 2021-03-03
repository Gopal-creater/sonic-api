import { Module } from '@nestjs/common';
import { RadiostationService } from './services/radiostation.service';
import { RadiostationController } from './controllers/radiostation.controller';
import { RadioStationRepository } from '../../repositories/radiostation.repository';
import { RadiostationSonicKeysController } from './controllers/radiostation-sonickeys.controller';
import { RadiostationSonicKeysService } from './services/radiostation-sonickeys.service';
import { RadioStationSonicKeyRepository } from '../../repositories/radiostationSonickey.repository';

@Module({
  controllers: [RadiostationController,RadiostationSonicKeysController],
  providers: [RadiostationService,RadiostationSonicKeysService,RadioStationRepository,RadioStationSonicKeyRepository]
})
export class RadiostationModule {}
