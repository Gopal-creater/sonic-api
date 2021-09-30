import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsPositive } from 'class-validator';

export class AnyQueryDto{
  // @IsOptional()
  // @ApiProperty({description:"Here you can add any query string as you need for your query options, But please follow the standard here https://www.npmjs.com/package/mongoose-query-parser"})
  query?: Object;
}
