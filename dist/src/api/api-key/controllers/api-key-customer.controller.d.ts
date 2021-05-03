import { ApiKeyService } from '../api-key.service';
import { CreateApiKeyDto } from '../dto/create-api-key.dto';
import { UpdateApiKeyDto } from '../dto/update-api-key.dto';
import { QueryDto } from '../../../shared/dtos/query.dto';
export declare class ApiKeyCustomerController {
    private readonly apiKeyService;
    constructor(apiKeyService: ApiKeyService);
    create(customer: string, createApiKeyDto: CreateApiKeyDto): Promise<import("../schemas/api-key.schema").ApiKey>;
    findAll(customer: string, queryDto: QueryDto): Promise<import("../schemas/api-key.schema").ApiKey[]>;
    findOne(customer: string, apikey: string): Promise<import("../schemas/api-key.schema").ApiKey>;
    update(customer: string, apikey: string, updateApiKeyDto: UpdateApiKeyDto): Promise<import("../schemas/api-key.schema").ApiKey>;
    makeDiabled(customer: string, apikey: string): Promise<import("../schemas/api-key.schema").ApiKey>;
    makeEnabled(customer: string, apikey: string): Promise<import("../schemas/api-key.schema").ApiKey>;
    remove(customer: string, apikey: string): Promise<import("../schemas/api-key.schema").ApiKey>;
}
