import { IUploadedFile } from '../../../shared/interfaces/UploadedFile.interface';
import { SonickeyService } from '../../sonickey/sonickey.service';
import { ExternalSonickeyService } from './externalsonickey.service';
export declare class ExternalSonickeyController {
    private readonly externalSonicKeyService;
    private readonly sonickeyService;
    constructor(externalSonicKeyService: ExternalSonickeyService, sonickeyService: SonickeyService);
    decode(file: IUploadedFile): Promise<any[]>;
}
