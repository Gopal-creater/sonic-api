import { SonickeyService } from '../../sonickey/sonickey.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ExternalSonickeyService  {
  constructor(
    private readonly sonickeyService: SonickeyService,
  ) {
  }

}



