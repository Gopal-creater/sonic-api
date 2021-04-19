import { FileHandlerService } from './../../shared/services/file-handler.service';
import { Module } from '@nestjs/common';
import { SonickeyController } from './sonickey.controller';
import { SonickeyService } from './sonickey.service';
import { KeygenService } from '../../shared/modules/keygen/keygen.service';
import { MongooseModule } from '@nestjs/mongoose';
import { SonicKeySchema,SonicKeySchemaName } from '../../schemas/sonickey.schema';
import { FileOperationService } from '../../shared/services/file-operation.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SonicKeySchemaName, schema: SonicKeySchema },
    ]),
  ],
  controllers: [SonickeyController],
  providers: [
    SonickeyService,
    KeygenService,
    FileOperationService,
    FileHandlerService,
  ],
  exports: [SonickeyService],
})
export class SonickeyModule {}
