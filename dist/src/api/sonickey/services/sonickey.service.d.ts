import { SonicKeyDto } from '../dtos/sonicKey.dto';
import { IUploadedFile } from '../../../shared/interfaces/UploadedFile.interface';
import { FileHandlerService } from '../../../shared/services/file-handler.service';
import { FileOperationService } from '../../../shared/services/file-operation.service';
import { SonicKey } from '../schemas/sonickey.schema';
import * as mm from 'music-metadata';
import { CreateSonicKeyFromJobDto } from '../dtos/create-sonickey.dto';
import { Model } from 'mongoose';
import { QueryDto } from '../../../shared/dtos/query.dto';
import { MongoosePaginateDto } from '../dtos/mongoosepaginate.dto';
export declare class SonickeyService {
    sonicKeyModel: Model<SonicKey>;
    private readonly fileOperationService;
    private readonly fileHandlerService;
    constructor(sonicKeyModel: Model<SonicKey>, fileOperationService: FileOperationService, fileHandlerService: FileHandlerService);
    generateUniqueSonicKey(): string;
    createFromJob(createSonicKeyDto: CreateSonicKeyFromJobDto): Promise<SonicKey>;
    getAll(queryDto?: QueryDto): Promise<MongoosePaginateDto>;
    encode(file: IUploadedFile, encodingStrength?: number): Promise<{
        downloadFileUrl: string;
        outFilePath: string;
        sonicKey: string;
    }>;
    decode(file: IUploadedFile): Promise<unknown>;
    decodeAllKeys(file: IUploadedFile): Promise<{
        sonicKeys: string[];
    }>;
    exractMusicMetaFromFile(filePath: string): Promise<mm.IAudioMetadata>;
    autoPopulateSonicContentWithMusicMetaForFile(file: IUploadedFile, sonicKeyDto?: SonicKeyDto): Promise<SonicKeyDto>;
    findBySonicKey(sonicKey: string): Promise<SonicKey>;
    findBySonicKeyOrFail(sonicKey: string): Promise<SonicKey>;
}
