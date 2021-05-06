import { ApiKeyService } from '../api-key.service';
import { CreateApiKeyDto } from '../dto/create-api-key.dto';
import { UpdateApiKeyDto } from '../dto/update-api-key.dto';
import { QueryDto } from '../../../shared/dtos/query.dto';
export declare class ApiKeyController {
    private readonly apiKeyService;
    constructor(apiKeyService: ApiKeyService);
    create(createApiKeyDto: CreateApiKeyDto): Promise<import("../schemas/api-key.schema").ApiKey>;
    findAll(queryDto?: QueryDto): Promise<import("../dto/mongoosepaginate.dto").MongoosePaginateDto>;
    getCount(query: any): Promise<number>;
    findOne(id: string): Promise<import("../schemas/api-key.schema").ApiKey>;
    update(id: string, updateApiKeyDto: UpdateApiKeyDto): Promise<import("../schemas/api-key.schema").ApiKey>;
    remove(id: string): Promise<import("../schemas/api-key.schema").ApiKey>;
}
