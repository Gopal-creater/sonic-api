/// <reference types="mongoose" />
import { DetectionService } from '../detection.service';
import { TopRadioStationWithTopSonicKey } from '../dto/general.dto';
import { SonickeyService } from '../../sonickey/services/sonickey.service';
import { ParsedQueryDto } from '../../../shared/dtos/parsedquery.dto';
import { groupByTime } from 'src/shared/types';
export declare class DetectionOwnerController {
    private readonly detectionService;
    private readonly sonickeyServive;
    constructor(detectionService: DetectionService, sonickeyServive: SonickeyService);
    getTopRadiostations(targetUser: string, queryDto: ParsedQueryDto): Promise<TopRadioStationWithTopSonicKey[]>;
    getSonicKeyGraphs(targetUser: string, radioStation: string, time: groupByTime, queryDto: ParsedQueryDto): Promise<{
        _id: any;
        year: number;
        month: number;
        day: number;
        hits: number;
    }[]>;
    findAll(targetUser: string, channel: string, queryDto?: ParsedQueryDto): Promise<import("../dto/mongoosepaginate-radiostationsonickey.dto").MongoosePaginateDeectionDto>;
    getDetectedDetailsOfSingleSonicKey(targetUser: string, channel: string, sonicKey: string, queryDto?: ParsedQueryDto): Promise<import("../dto/mongoosepaginate-radiostationsonickey.dto").MongoosePaginateDeectionDto>;
    getCount(targetUser: string, channel: string, queryDto?: ParsedQueryDto): import("mongoose").Query<number, import("../schemas/detection.schema").Detection, {}>;
}
