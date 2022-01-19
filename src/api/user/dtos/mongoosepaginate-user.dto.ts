import { ApiProperty } from '@nestjs/swagger';
import { UserDB } from '../schemas/user.db.schema';

export class MongoosePaginateUserDto {
  @ApiProperty({isArray:true,type:UserDB})
  docs: [UserDB];

  @ApiProperty()
  totalDocs: number;

  @ApiProperty()
  offset: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  totalPages: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  pagingCounter: number;

  @ApiProperty()
  hasPrevPage: boolean;

  @ApiProperty()
  hasNextPage: boolean;

  @ApiProperty()
  prevPage: number;

  @ApiProperty()
  nextPage: number;
}
