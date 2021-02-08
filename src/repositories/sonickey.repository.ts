import { SonicKey } from './../schemas/sonickey.schema';
import { GlobalDynamoDbDataMapper } from './../shared/modules/global-aws/global-aws.service';
import { GlobalAwsService } from 'src/shared/modules/global-aws/global-aws.service';
import { Injectable } from '@nestjs/common';


@Injectable()
export class SonicKeyRepository extends GlobalDynamoDbDataMapper {
  constructor(private readonly globalAwsService:GlobalAwsService) {
    super()
  }

  ensureTableExistsAndCreate() {
    return this.ensureTableExists(SonicKey, {
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
}
