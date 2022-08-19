"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalDynamoDbDataMapper = exports.GlobalAwsService = void 0;
const common_1 = require("@nestjs/common");
const AWS = require("aws-sdk");
const client_s3_1 = require("@aws-sdk/client-s3");
const dynamodb_data_mapper_1 = require("@aws/dynamodb-data-mapper");
const config_1 = require("@nestjs/config");
const aws_sdk_1 = require("aws-sdk");
let GlobalAwsService = class GlobalAwsService {
    constructor(configService) {
        this.configService = configService;
        AWS.config.update({
            accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
            secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
            region: this.configService.get('AWS_REGION'),
        });
    }
    getDynamoDbMapper() {
        const client = new AWS.DynamoDB({});
        const mapper = new dynamodb_data_mapper_1.DataMapper({ client: client });
        return mapper;
    }
    getDynamoDbMapperConfiguration() {
        const client = new AWS.DynamoDB({});
        return { client: client };
    }
    getDynamoDbDocumentClient() {
        const docClient = new AWS.DynamoDB.DocumentClient();
        return docClient;
    }
    getS3() {
        const s3 = new AWS.S3({
            accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
            secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
        });
        return s3;
    }
    getS3ClientV2() {
        return new client_s3_1.S3Client({
            credentials: {
                accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
                secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
            },
        });
    }
    getCognitoIdentityServiceProvider() {
        const cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider({
            region: this.configService.get('COGNITO_REGION'),
        });
        return cognitoIdentityServiceProvider;
    }
};
GlobalAwsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], GlobalAwsService);
exports.GlobalAwsService = GlobalAwsService;
class GlobalDynamoDbDataMapper extends dynamodb_data_mapper_1.DataMapper {
    constructor() {
        super({
            client: new aws_sdk_1.DynamoDB({}),
        });
    }
}
exports.GlobalDynamoDbDataMapper = GlobalDynamoDbDataMapper;
//# sourceMappingURL=global-aws.service.js.map