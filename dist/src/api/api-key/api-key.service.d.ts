import { CreateApiKeyDto } from './dto/create-api-key.dto';
import { ApiKey } from './schemas/api-key.schema';
import { Model } from 'mongoose';
import { ParsedQueryDto } from '../../shared/dtos/parsedquery.dto';
import { MongoosePaginateApiKeyDto } from './dto/mongoosepaginate-apikey.dto';
import { UserService } from '../user/user.service';
export declare class ApiKeyService {
    readonly apiKeyModel: Model<ApiKey>;
    readonly userService: UserService;
    constructor(apiKeyModel: Model<ApiKey>, userService: UserService);
    create(createApiKeyDto: CreateApiKeyDto): Promise<ApiKey>;
    makeEnableDisable(id: string, disabled: boolean): Promise<ApiKey>;
    findAll(queryDto: ParsedQueryDto): Promise<MongoosePaginateApiKeyDto>;
    removeById(id: string): Promise<ApiKey>;
}
