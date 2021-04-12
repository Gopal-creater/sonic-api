import { Model } from 'mongoose';
import { CreateCatDto } from './dto/create-cat.dto';
import { Cat } from './schemas/cat.schema';
import { RadioStation } from '../../schemas/radiostation.schema';
import { CreateRadiostationDto } from '../radiostation/dto/create-radiostation.dto';
export declare class CatsService {
    private readonly catModel;
    private readonly radioStationModel;
    constructor(catModel: Model<Cat>, radioStationModel: Model<RadioStation>);
    create(createCatDto: CreateCatDto): Promise<Cat>;
    createRS(createRadiostationDto: CreateRadiostationDto): Promise<RadioStation>;
    findAll(): Promise<Cat[]>;
}
