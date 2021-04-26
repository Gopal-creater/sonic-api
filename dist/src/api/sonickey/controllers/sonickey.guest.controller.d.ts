import { SonicKeyDto } from '../dtos/sonicKey.dto';
import { IUploadedFile } from '../../../shared/interfaces/UploadedFile.interface';
import { SonickeyService } from '../services/sonickey.service';
import { SonicKey } from '../../../schemas/sonickey.schema';
import { FileHandlerService } from '../../../shared/services/file-handler.service';
export declare class SonickeyGuestController {
    private readonly sonicKeyService;
    private readonly fileHandlerService;
    constructor(sonicKeyService: SonickeyService, fileHandlerService: FileHandlerService);
    encode(sonicKeyDto: SonicKeyDto, file: IUploadedFile, req: any): Promise<SonicKey>;
    decode(file: IUploadedFile): Promise<SonicKey[]>;
}
