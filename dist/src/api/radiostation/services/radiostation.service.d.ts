import { CreateRadiostationDto } from '../dto/create-radiostation.dto';
import { RadioStation } from '../schemas/radiostation.schema';
import { Model } from 'mongoose';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SonickeyService } from '../../sonickey/services/sonickey.service';
import { MongoosePaginateRadioStationDto } from '../dto/mongoosepaginate-radiostation.dto';
import { ParsedQueryDto } from '../../../shared/dtos/parsedquery.dto';
export declare class RadiostationService {
    readonly radioStationModel: Model<RadioStation>;
    readonly sonickeyService: SonickeyService;
    private readonly eventEmitter;
    constructor(radioStationModel: Model<RadioStation>, sonickeyService: SonickeyService, eventEmitter: EventEmitter2);
    create(createRadiostationDto: CreateRadiostationDto): Promise<RadioStation>;
    stopListeningStream(id: string): Promise<RadioStation>;
    startListeningStream(id: string): Promise<RadioStation>;
    findAll(queryDto: ParsedQueryDto): Promise<MongoosePaginateRadioStationDto>;
    findByIdOrFail(id: string): Promise<RadioStation>;
    removeById(id: string): Promise<RadioStation>;
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
}
