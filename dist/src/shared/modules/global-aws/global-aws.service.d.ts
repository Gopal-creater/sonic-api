import * as AWS from 'aws-sdk';
import { DataMapper, DataMapperConfiguration } from '@aws/dynamodb-data-mapper';
import { ConfigService } from '@nestjs/config';
export declare class GlobalAwsService {
    private readonly configService;
    constructor(configService: ConfigService);
    getDynamoDbMapper(): DataMapper;
    getDynamoDbMapperConfiguration(): DataMapperConfiguration;
    getDynamoDbDocumentClient(): AWS.DynamoDB.DocumentClient;
    getS3(): AWS.S3;
    getCognitoIdentityServiceProvider(): AWS.CognitoIdentityServiceProvider;
}
export declare class GlobalDynamoDbDataMapper extends DataMapper {
    constructor();
}
