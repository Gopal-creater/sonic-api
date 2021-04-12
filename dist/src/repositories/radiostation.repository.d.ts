import { GlobalDynamoDbDataMapper } from '../shared/modules/global-aws/global-aws.service';
import { GlobalAwsService } from '../shared/modules/global-aws/global-aws.service';
export declare class RadioStationRepository extends GlobalDynamoDbDataMapper {
    private readonly globalAwsService;
    constructor(globalAwsService: GlobalAwsService);
    ensureTableExistsAndCreate(): Promise<void>;
}
