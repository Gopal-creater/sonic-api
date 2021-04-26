import { CreateThirdpartyDetectionDto } from './dto/create-thirdparty-detection.dto';
import { UpdateThirdpartyDetectionDto } from './dto/update-thirdparty-detection.dto';
import { ThirdpartyDetection } from './schemas/thirdparty-detection.schema';
import { Model } from 'mongoose';
import { QueryDto } from '../../shared/dtos/query.dto';
export declare class ThirdpartyDetectionService {
    readonly thirdpartyDetectionModel: Model<ThirdpartyDetection>;
    constructor(thirdpartyDetectionModel: Model<ThirdpartyDetection>);
    create(createThirdpartyDetectionDto: CreateThirdpartyDetectionDto): Promise<ThirdpartyDetection>;
    findAll(queryDto?: QueryDto): Promise<ThirdpartyDetection[]>;
    findById(id: string): import("mongoose").Query<ThirdpartyDetection, ThirdpartyDetection, {}>;
    update(id: string, updateThirdpartyDetectionDto: UpdateThirdpartyDetectionDto): import("mongoose").Query<ThirdpartyDetection, ThirdpartyDetection, {}>;
    remove(id: string): import("mongoose").Query<ThirdpartyDetection, ThirdpartyDetection, {}>;
}
