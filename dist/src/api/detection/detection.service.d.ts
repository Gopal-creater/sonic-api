import { Detection } from './schemas/detection.schema';
import { Model } from 'mongoose';
import { ParsedQueryDto } from '../../shared/dtos/parsedquery.dto';
import { MongoosePaginateDeectionDto } from './dto/mongoosepaginate-radiostationsonickey.dto';
import { groupByTime } from 'src/shared/types';
import { TopRadioStation, TopRadioStationWithTopSonicKey, TopSonicKey } from './dto/general.dto';
export declare class DetectionService {
    readonly detectionModel: Model<Detection>;
    constructor(detectionModel: Model<Detection>);
    findAll(queryDto: ParsedQueryDto): Promise<MongoosePaginateDeectionDto>;
    findTopRadioStationsWithSonicKeysForOwner(ownerId: string, topLimit: number, filter?: object): Promise<TopRadioStationWithTopSonicKey[]>;
    findTopRadioStations(filter: object, topLimit: number): Promise<TopRadioStation[]>;
    findTopSonicKeysForRadioStation(radioStationId: string, topLimit: number, filter?: object): Promise<TopSonicKey[]>;
    findGraphOfSonicKeysForRadioStationInSpecificTime(radioStationId: string, groupByTime: groupByTime, filter?: object): Promise<{
        _id: any;
        year: number;
        month: number;
        day: number;
        hits: number;
    }[]>;
}
