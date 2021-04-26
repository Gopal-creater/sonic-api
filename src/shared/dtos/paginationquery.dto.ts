import { IsOptional, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PaginationQueryDto {
  @IsOptional()
//   @IsPositive()
  @ApiProperty()
  _limit?: number=100;

  @IsOptional()
//   @IsPositive()
  @ApiProperty()
  _start?: number=0;
}
