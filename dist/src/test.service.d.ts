import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { SonicKeyRepository } from './repositories/sonickey.repository';
import { GlobalAwsService } from './shared/modules/global-aws/global-aws.service';
export declare class TestService {
    readonly repository: SonicKeyRepository;
    readonly globalAwsService: GlobalAwsService;
    private dbClient;
    constructor(repository: SonicKeyRepository, globalAwsService: GlobalAwsService);
    runTest(): Promise<import("aws-sdk/lib/request").PromiseResult<DocumentClient.PutItemOutput, import("aws-sdk").AWSError>>;
}
