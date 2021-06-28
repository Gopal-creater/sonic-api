import { ApiKeyService } from '../api-key.service';
import { CreateApiKeyDto } from '../dto/create-api-key.dto';
import { UpdateApiKeyDto } from '../dto/update-api-key.dto';
import { ParsedQueryDto } from '../../../shared/dtos/parsedquery.dto';
export declare class ApiKeyController {
    private readonly apiKeyService;
    constructor(apiKeyService: ApiKeyService);
    create(createApiKeyDto: CreateApiKeyDto): Promise<import("../schemas/api-key.schema").ApiKey>;
    findAll(queryDto?: ParsedQueryDto): Promise<import("../dto/mongoosepaginate-apikey.dto").MongoosePaginateApiKeyDto>;
    getCount(queryDto: ParsedQueryDto): Promise<number>;
    findOne(id: string): Promise<import("../schemas/api-key.schema").ApiKey>;
    update(id: string, updateApiKeyDto: UpdateApiKeyDto): Promise<import("../schemas/api-key.schema").ApiKey>;
    remove(id: string): Promise<import("../schemas/api-key.schema").ApiKey>;
}
