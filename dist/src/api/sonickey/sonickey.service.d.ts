import { SonicKeyDto } from './dtos/sonicKey.dto';
import { IUploadedFile } from './../../shared/interfaces/UploadedFile.interface';
import { FileHandlerService } from './../../shared/services/file-handler.service';
import { FileOperationService } from './../../shared/services/file-operation.service';
import { SonicKeyRepository } from './../../repositories/sonickey.repository';
import { SonicKey } from '../../schemas/sonickey.schema';
import * as mm from 'music-metadata';
export declare class SonickeyService {
    readonly sonicKeyRepository: SonicKeyRepository;
    private readonly fileOperationService;
    private readonly fileHandlerService;
    constructor(sonicKeyRepository: SonicKeyRepository, fileOperationService: FileOperationService, fileHandlerService: FileHandlerService);
    generateUniqueSonicKey(): string;
    getAll(): Promise<any[]>;
    getAllWithFilter(queryParams: Object): Promise<any[]>;
    encode(file: IUploadedFile, encodingStrength?: number): Promise<{
        downloadFileUrl: string;
        outFilePath: string;
        sonicKey: string;
    }>;
    decode(file: IUploadedFile): Promise<unknown>;
    search(): Promise<SonicKey>;
    exractMusicMetaFromFile(filePath: string): Promise<mm.IAudioMetadata>;
    autoPopulateSonicContentWithMusicMetaForFile(file: IUploadedFile, sonicKeyDto?: SonicKeyDto): Promise<SonicKeyDto>;
    findBySonicKey(sonicKey: string): Promise<SonicKey>;
    findByOwner(owner: string): Promise<SonicKey[]>;
    findByJob(job: string): Promise<SonicKey[]>;
    findBySonicKeyOrFail(sonicKey: string): Promise<SonicKey>;
}
