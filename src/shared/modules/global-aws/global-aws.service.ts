import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import {S3Client} from '@aws-sdk/client-s3';
import {
  DataMapper,
  DataMapperConfiguration,
  ScanParameters,
} from '@aws/dynamodb-data-mapper';
import { ConfigService } from '@nestjs/config';
import { DynamoDB } from 'aws-sdk';
@Injectable()
export class GlobalAwsService {
  constructor(private readonly configService: ConfigService) {
    AWS.config.update({
      accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      region: this.configService.get('AWS_REGION'),
    });
  }

  getDynamoDbMapper(): DataMapper {
    const client = new AWS.DynamoDB({});

    const mapper = new DataMapper({ client: client });
    return mapper;
  }

  getDynamoDbMapperConfiguration(): DataMapperConfiguration {
    const client = new AWS.DynamoDB({});

    return { client: client };
  }

  getDynamoDbDocumentClient(): AWS.DynamoDB.DocumentClient {
    const docClient = new AWS.DynamoDB.DocumentClient();
    return docClient;
  }

  getS3(): AWS.S3 {
    const s3 = new AWS.S3({
      accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      // region:this.configService.get('AWS_REGION')
    });
    return s3;
  }

  getS3ClientV2():S3Client {
    return new S3Client({
      credentials: {
        accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      },
    });
  }

  getCognitoIdentityServiceProvider(): AWS.CognitoIdentityServiceProvider {
    const cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider(
      {
        region: this.configService.get('COGNITO_REGION'),
      },
    );
    return cognitoIdentityServiceProvider;
  }
}

export class GlobalDynamoDbDataMapper extends DataMapper {
  constructor() {
    super({
      client: new DynamoDB({}),
    });
  }
}
