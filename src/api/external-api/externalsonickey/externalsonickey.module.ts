import { SonickeyModule } from '../../sonickey/sonickey.module';
import { Module } from '@nestjs/common';
import { ExternalSonickeyController } from './externalsonickey.controller';
import { ExternalSonickeyService } from './externalsonickey.service';

@Module({
  imports:[SonickeyModule],
  controllers: [ExternalSonickeyController],
  providers: [ExternalSonickeyService]
})
export class ExternalSonickeyModule {}
