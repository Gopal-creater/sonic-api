import { Module } from '@nestjs/common';
import { RadiostationService } from './radiostation.service';
import { RadiostationController } from './radiostation.controller';
import { RadioStationRepository } from '../../repositories/radiostation.repository';

@Module({
  controllers: [RadiostationController],
  providers: [RadiostationService,RadioStationRepository]
})
export class RadiostationModule {}
