import { IsOptional, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PaginationQueryDto {
  @IsOptional()
//   @IsPositive()
  @ApiProperty()
  limit?: number=100;

  @IsOptional()
//   @IsPositive()
  @ApiProperty()
  offset?: number=0;
}
