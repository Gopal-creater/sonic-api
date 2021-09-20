import { SonicKeyDto } from '../dtos/sonicKey.dto';
import { IUploadedFile } from '../../../shared/interfaces/UploadedFile.interface';
import { SonickeyService } from '../services/sonickey.service';
import { SonicKey } from '../schemas/sonickey.schema';
import { FileHandlerService } from '../../../shared/services/file-handler.service';
import { DetectionService } from '../../detection/detection.service';
export declare class SonickeyGuestController {
    private readonly sonicKeyService;
    private readonly fileHandlerService;
    private readonly detectionService;
    constructor(sonicKeyService: SonickeyService, fileHandlerService: FileHandlerService, detectionService: DetectionService);
    encode(sonicKeyDto: SonicKeyDto, file: IUploadedFile, req: any): Promise<SonicKey>;
    decode(channel: string, file: IUploadedFile): Promise<SonicKey[]>;
}
