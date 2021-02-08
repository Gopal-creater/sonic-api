import { KeygenService } from './keygen.service';
import { Module, Global } from '@nestjs/common';

@Module({
    imports: [],
    providers: [KeygenService],
    exports:[KeygenService]
  })
export class KeygenModule {}
