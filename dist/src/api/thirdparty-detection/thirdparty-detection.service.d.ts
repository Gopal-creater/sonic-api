import { UpdateThirdpartyDetectionDto } from './dto/update-thirdparty-detection.dto';
import { ThirdpartyDetection } from './schemas/thirdparty-detection.schema';
import { Model } from 'mongoose';
import { QueryDto } from '../../shared/dtos/query.dto';
import { MongoosePaginateThirdPartyDetectionDto } from './dto/mongoosepaginate-thirdpartydetection.dto';
export declare class ThirdpartyDetectionService {
    readonly thirdpartyDetectionModel: Model<ThirdpartyDetection>;
    constructor(thirdpartyDetectionModel: Model<ThirdpartyDetection>);
    findAll(queryDto?: QueryDto): Promise<MongoosePaginateThirdPartyDetectionDto>;
    findById(id: string): import("mongoose").Query<ThirdpartyDetection, ThirdpartyDetection, {}>;
    update(id: string, updateThirdpartyDetectionDto: UpdateThirdpartyDetectionDto): import("mongoose").Query<ThirdpartyDetection, ThirdpartyDetection, {}>;
    remove(id: string): import("mongoose").Query<ThirdpartyDetection, ThirdpartyDetection, {}>;
}
