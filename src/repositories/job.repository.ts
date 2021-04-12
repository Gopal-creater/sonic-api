import { Job } from '../schemas/job.schema';
import { GlobalDynamoDbDataMapper } from '../shared/modules/global-aws/global-aws.service';
import { GlobalAwsService } from '../shared/modules/global-aws/global-aws.service';
import { Injectable } from '@nestjs/common';


@Injectable()
export class JobRepository extends GlobalDynamoDbDataMapper {
  constructor(private readonly globalAwsService:GlobalAwsService) {
    super()
  }

  ensureTableExistsAndCreate() {
    return this.ensureTableExists(Job, {
      readCapacityUnits: 5,
      writeCapacityUnits: 5,
      indexOptions: {
        ownerIndex: {
          type: 'global',
          projection: 'all',
          readCapacityUnits: 5,
          writeCapacityUnits: 5,
        }
      }
    });
  }
}
