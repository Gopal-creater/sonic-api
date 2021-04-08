import {
  attribute,
  hashKey,
  rangeKey,
  table,
} from '@aws/dynamodb-data-mapper-annotations';
import { ApiProperty } from '@nestjs/swagger';


@table('RadioStation-SonicKey')
export class RadioStationSonicKey {
  constructor(data?: Partial<RadioStationSonicKey>) {
    Object.assign(this, data);
  }

  @ApiProperty()
  @hashKey({
    indexKeyConfigurations: {
        RadioStationSonicKey_GSI1: 'RANGE',
    },
  })
  radioStation: string;

  @ApiProperty()
  @rangeKey({
    indexKeyConfigurations: {
        RadioStationSonicKey_GSI1: 'HASH',
    },
  })
  sonicKey: string;

  @ApiProperty()
  @attribute()
  count: number;

  @ApiProperty()
  @attribute()
  owner: string;
}
