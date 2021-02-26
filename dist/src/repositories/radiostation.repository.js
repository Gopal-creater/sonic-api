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
exports.RadioStationRepository = void 0;
const global_aws_service_1 = require("../shared/modules/global-aws/global-aws.service");
const global_aws_service_2 = require("../shared/modules/global-aws/global-aws.service");
const common_1 = require("@nestjs/common");
const radiostation_schema_1 = require("../schemas/radiostation.schema");
let RadioStationRepository = class RadioStationRepository extends global_aws_service_1.GlobalDynamoDbDataMapper {
    constructor(globalAwsService) {
        super();
        this.globalAwsService = globalAwsService;
    }
    ensureTableExistsAndCreate() {
        return this.ensureTableExists(radiostation_schema_1.RadioStation, {
            readCapacityUnits: 5,
            writeCapacityUnits: 5,
            indexOptions: {
                ownerIndex: {
                    type: 'global',
                    projection: 'all',
                    readCapacityUnits: 5,
                    writeCapacityUnits: 5,
                },
            }
        });
    }
};
RadioStationRepository = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [global_aws_service_2.GlobalAwsService])
], RadioStationRepository);
exports.RadioStationRepository = RadioStationRepository;
//# sourceMappingURL=radiostation.repository.js.map