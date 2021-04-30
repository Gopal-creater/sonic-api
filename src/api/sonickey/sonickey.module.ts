import { FileHandlerService } from './../../shared/services/file-handler.service';
import { Module } from '@nestjs/common';
import { SonickeyController } from './controllers/sonickey.controller';
import { SonickeyService } from './services/sonickey.service';
import { KeygenService } from '../../shared/modules/keygen/keygen.service';
import { MongooseModule } from '@nestjs/mongoose';
import { SonicKeySchema,SonicKeySchemaName } from './schemas/sonickey.schema';
import { FileOperationService } from '../../shared/services/file-operation.service';
import { SonickeyGuestController } from './controllers/sonickey.guest.controller';

@Module({
  imports: [
  MongooseModule.forFeature([
      { name: SonicKeySchemaName, schema: SonicKeySchema },
    ]),
  ],
  controllers: [SonickeyController,SonickeyGuestController],
  providers: [
    SonickeyService,
    KeygenService,
    FileOperationService,
    FileHandlerService,
  ],
  exports: [SonickeyService],
})
export class SonickeyModule {}
