import { CreateRadiostationDto } from '../dto/create-radiostation.dto';
import { RadioStation } from '../../../schemas/radiostation.schema';
import { Model } from 'mongoose';
import { QueryDto } from '../../../shared/dtos/query.dto';
import { SonickeyService } from '../../sonickey/sonickey.service';
export declare class RadiostationService {
    readonly radioStationModel: Model<RadioStation>;
    readonly sonickeyService: SonickeyService;
    constructor(radioStationModel: Model<RadioStation>, sonickeyService: SonickeyService);
    create(createRadiostationDto: CreateRadiostationDto): Promise<RadioStation>;
    stopListeningStream(id: string): Promise<RadioStation>;
    startListeningStream(id: string): Promise<RadioStation>;
    findAll(queryDto?: QueryDto): Promise<RadioStation[]>;
    findByIdOrFail(id: string): Promise<RadioStation>;
    removeById(id: string): Promise<any>;
    bulkRemove(ids: [string]): Promise<{
        passedData: RadioStation[];
        failedData: {
            promiseError: any;
            data: string;
        }[];
    }>;
    bulkStartListeningStream(ids: [string]): Promise<{
        passedData: RadioStation[];
        failedData: {
            promiseError: any;
            data: string;
        }[];
    }>;
    bulkStopListeningStream(ids: [string]): Promise<{
        passedData: RadioStation[];
        failedData: {
            promiseError: any;
            data: string;
        }[];
    }>;
    startListeningLikeAStream(streamUrl: string, outputPath: string): void;
}
