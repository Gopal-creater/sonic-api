import { CreateSonicKeyFromJobDto } from './dtos/create-sonickey.dto';
import { UpdateSonicKeyDto } from './dtos/update-sonickey.dto';
import { SonicKeyDto } from './dtos/sonicKey.dto';
import { IUploadedFile } from './../../shared/interfaces/UploadedFile.interface';
import { KeygenService } from './../../shared/modules/keygen/keygen.service';
import { SonickeyService } from './sonickey.service';
import { SonicKey } from '../../schemas/sonickey.schema';
import { FileHandlerService } from '../../shared/services/file-handler.service';
import { DownloadDto } from './dtos/download.dto';
import { QueryDto } from '../../shared/dtos/query.dto';
export declare class SonickeyController {
    private readonly sonicKeyService;
    private readonly keygenService;
    private readonly fileHandlerService;
    constructor(sonicKeyService: SonickeyService, keygenService: KeygenService, fileHandlerService: FileHandlerService);
    getAll(queryDto: QueryDto): Promise<SonicKey[]>;
    generateUniqueSonicKey(): Promise<string>;
    createForJob(createSonicKeyDto: CreateSonicKeyFromJobDto, owner: string, req: any): Promise<SonicKey>;
    getOwnersKeys(ownerId: string, queryDto: QueryDto): Promise<SonicKey[]>;
    getKeysByJob(jobId: string, queryDto: QueryDto): Promise<SonicKey[]>;
    getOne(sonickey: string): Promise<SonicKey>;
    encode(sonicKeyDto: SonicKeyDto, file: IUploadedFile, owner: string, req: any): Promise<SonicKey>;
    decode(file: IUploadedFile): Promise<any[]>;
    updateMeta(sonickey: string, updateSonicKeyDto: UpdateSonicKeyDto): Promise<SonicKey>;
    delete(sonickey: string): Promise<{
        ok?: number;
        n?: number;
    } & {
        deletedCount?: number;
    }>;
    downloadFile(data: DownloadDto, userId: string, response: any): Promise<any>;
}
