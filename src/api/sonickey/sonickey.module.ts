import { FileHandlerService } from './../../shared/services/file-handler.service';
import { SonicKeyRepository } from './../../repositories/sonickey.repository';
import { Module } from '@nestjs/common';
import { SonickeyController } from './sonickey.controller';
import { SonickeyService } from './sonickey.service';
import { KeygenService } from '../../shared/modules/keygen/keygen.service';
import { MongooseModule } from '@nestjs/mongoose';
import { SonicKey, SonicKeySchema } from '../../schemas/sonickey.schema';
import { FileOperationService } from '../../shared/services/file-operation.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SonicKey.name, schema: SonicKeySchema },
    ]),
  ],
  controllers: [SonickeyController],
  providers: [
    SonickeyService,
    SonicKeyRepository,
    KeygenService,
    FileOperationService,
    FileHandlerService,
  ],
  exports: [SonickeyService],
})
export class SonickeyModule {}
