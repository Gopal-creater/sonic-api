import { IsOptional, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PaginationQueryDto {
  @IsOptional()
  @ApiProperty()
  _limit?: number=100;

  @IsOptional()
  @ApiProperty()
  _offset?: number=0;

  @IsOptional()
  @ApiProperty({description:"Eg: createdAt:desc Or createdAt:desc,email:asc"})
  _sort?: string;

  @IsOptional()
  @ApiProperty()
  _page?: number=1;

}
