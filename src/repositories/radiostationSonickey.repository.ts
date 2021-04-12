import { SonicKey } from '../schemas/sonickey.schema';
import { GlobalDynamoDbDataMapper } from '../shared/modules/global-aws/global-aws.service';
import { GlobalAwsService } from '../shared/modules/global-aws/global-aws.service';
import { Injectable } from '@nestjs/common';
import { RadioStationSonicKey } from '../schemas/radiostation-sonickey.schema';


@Injectable()
export class RadioStationSonicKeyRepository extends GlobalDynamoDbDataMapper {
  constructor(private readonly globalAwsService:GlobalAwsService) {
    super()
  }

  ensureTableExistsAndCreate() {
    return this.ensureTableExists(RadioStationSonicKey, {
      readCapacityUnits: 5,
      writeCapacityUnits: 5,
      indexOptions: {
        RadioStationSonicKey_GSI1: {
          type: 'global',
          projection: 'all',
          readCapacityUnits: 5,
          writeCapacityUnits: 5,
        },
      }
    });
  }
}
