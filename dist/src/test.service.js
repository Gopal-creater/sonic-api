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
exports.TestService = void 0;
const common_1 = require("@nestjs/common");
const sonickey_repository_1 = require("./repositories/sonickey.repository");
const global_aws_service_1 = require("./shared/modules/global-aws/global-aws.service");
const sonictest_schema_1 = require("./schemas/sonictest.schema");
let TestService = class TestService {
    constructor(repository, globalAwsService) {
        this.repository = repository;
        this.globalAwsService = globalAwsService;
        this.dbClient = this.globalAwsService.getDynamoDbDocumentClient();
    }
    runTest() {
        const sonicTest = new sonictest_schema_1.SonicTest({
            sonicKey: 'key1',
            licenseId: '123',
            encodingStrength: 1,
            contentFileType: 'wav',
            contentSize: 1024,
        });
        const Item = {
            PK: "user234",
            SK: "profile",
            name: "Prabin",
            email: 'pk@gmail.com',
            phone: "9900925609"
        };
        return this.dbClient.put({
            TableName: 'study1',
            Item: Item,
        }).promise();
    }
};
TestService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [sonickey_repository_1.SonicKeyRepository,
        global_aws_service_1.GlobalAwsService])
], TestService);
exports.TestService = TestService;
//# sourceMappingURL=test.service.js.map