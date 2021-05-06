import { CreateApiKeyDto } from './dto/create-api-key.dto';
import { ApiKey } from './schemas/api-key.schema';
import { Model } from 'mongoose';
import { QueryDto } from '../../shared/dtos/query.dto';
import { MongoosePaginateDto } from './dto/mongoosepaginate.dto';
export declare class ApiKeyService {
    readonly apiKeyModel: Model<ApiKey>;
    constructor(apiKeyModel: Model<ApiKey>);
    create(createApiKeyDto: CreateApiKeyDto): Promise<ApiKey>;
    makeEnableDisable(id: string, disabled: boolean): Promise<ApiKey>;
    findAll(queryDto?: QueryDto): Promise<MongoosePaginateDto>;
    removeById(id: string): Promise<ApiKey>;
}
