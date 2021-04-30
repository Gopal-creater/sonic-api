import { IUploadedFile } from '../../../shared/interfaces/UploadedFile.interface';
import { SonickeyService } from '../../sonickey/services/sonickey.service';
import { SonicKey } from '../../sonickey/schemas/sonickey.schema';
import { ExternalSonickeyService } from './externalsonickey.service';
export declare class ExternalSonickeyController {
    private readonly externalSonicKeyService;
    private readonly sonickeyService;
    constructor(externalSonicKeyService: ExternalSonickeyService, sonickeyService: SonickeyService);
    decode(file: IUploadedFile): Promise<SonicKey[]>;
}
