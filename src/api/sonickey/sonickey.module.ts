import { FileHandlerService } from './../../shared/services/file-handler.service';
import { SonicKeyRepository } from './../../repositories/sonickey.repository';
import { Module } from '@nestjs/common';
import { SonickeyController } from './sonickey.controller';
import { SonickeyService } from './sonickey.service';
import { KeygenService } from '../../shared/modules/keygen/keygen.service';
import { FileOperationService} from '../../shared/services/file-operation.service'

@Module({
  controllers: [SonickeyController],
  providers: [SonickeyService,SonicKeyRepository,KeygenService,FileOperationService,FileHandlerService],
  exports:[SonickeyService]

})
export class SonickeyModule {}
