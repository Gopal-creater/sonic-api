import {
  attribute,
  hashKey,
  autoGeneratedHashKey,
  rangeKey,
  table,
} from '@aws/dynamodb-data-mapper-annotations';

@table('Job')
export class Job {
  constructor(data?: Partial<Job>) {
    Object.assign(this, data);
  }

  @autoGeneratedHashKey()
  id: string;

  @attribute({
    indexKeyConfigurations: {
      ownerIndex: 'HASH',
    },
  })
  owner: string;

  @attribute()
  licenseId: string;

  @attribute()
  reservedLicenceCount: number;

  @attribute()
  usedLicenceCount: number;

  @attribute({ defaultProvider: () => false })
  isComplete?: boolean;

  @attribute({ defaultProvider: () => new Date() })
  createdAt: Date;

  @attribute()
  completedAt: Date;

  @attribute()
  jobDetails: [{ [key: string]: any }];
}
