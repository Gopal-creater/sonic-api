import { SonicKeyDto } from './../../sonickey/dtos/sonicKey.dto';
import { IUploadedFile } from './../../../shared/interfaces/UploadedFile.interface';
import { SonickeyService } from '../../sonickey/sonickey.service';
import { SonicKey } from '../../../schemas/sonickey.schema';
import { ExternalSonickeyService } from './externalsonickey.service';
export declare class ExternalSonickeyController {
    private readonly externalSonicKeyService;
    private readonly sonickeyService;
    constructor(externalSonicKeyService: ExternalSonickeyService, sonickeyService: SonickeyService);
    encode(sonicKeyDto: SonicKeyDto, file: IUploadedFile): Promise<SonicKey>;
    decode(file: IUploadedFile): Promise<SonicKey>;
}
