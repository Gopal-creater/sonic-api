import * as AWS from 'aws-sdk';
import { S3Client } from '@aws-sdk/client-s3';
import { DataMapper, DataMapperConfiguration } from '@aws/dynamodb-data-mapper';
import { ConfigService } from '@nestjs/config';
export declare class GlobalAwsService {
    private readonly configService;
    constructor(configService: ConfigService);
    getDynamoDbMapper(): DataMapper;
    getDynamoDbMapperConfiguration(): DataMapperConfiguration;
    getDynamoDbDocumentClient(): AWS.DynamoDB.DocumentClient;
    getS3(): AWS.S3;
    getS3ClientV2(): S3Client;
    getCognitoIdentityServiceProvider(): AWS.CognitoIdentityServiceProvider;
}
export declare class GlobalDynamoDbDataMapper extends DataMapper {
    constructor();
}
