import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { GroupService } from './group.service';
import { CreateGroupDto } from './dtos/create-group.dto';
import { UpdateGroupDto } from './dtos/update-group.dto';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { RolesAllowed } from 'src/api/auth/decorators';
import { Roles } from 'src/constants/Enums';
import { JwtAuthGuard, RoleBasedGuard } from 'src/api/auth/guards';
import { AnyApiQueryTemplate } from '../../shared/decorators/anyapiquerytemplate.decorator';
import { ParseQueryValue } from '../../shared/pipes/parseQueryValue.pipe';
import { ParsedQueryDto } from 'src/shared/dtos/parsedquery.dto';

@ApiTags('Group Controller')
@Controller('groups')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @RolesAllowed(Roles.ADMIN)
  @UseGuards(JwtAuthGuard, RoleBasedGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create Group' })
  @Post()
  create(@Body() createGroupDto: CreateGroupDto) {
    return this.groupService.create(createGroupDto);
  }

  @RolesAllowed(Roles.ADMIN)
  @UseGuards(JwtAuthGuard, RoleBasedGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get Groups' })
  @Get()
  findAll(@Query(new ParseQueryValue()) parsedQueryDto: ParsedQueryDto) {
    return this.groupService.findAll(parsedQueryDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get Single Group' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.groupService.findById(id);
  }

  @RolesAllowed(Roles.ADMIN)
  @UseGuards(JwtAuthGuard, RoleBasedGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update Group' })
  @Put(':id')
  update(@Param('id') id: string, @Body() updateGroupDto: UpdateGroupDto) {
    return this.groupService.update(id, updateGroupDto);
  }

  @Get('/count')
  @UseGuards(JwtAuthGuard)
  @AnyApiQueryTemplate()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get count of all groups also accept filter as query params',
  })
  async getCount(@Query(new ParseQueryValue()) queryDto: ParsedQueryDto) {
    return this.groupService.getCount(queryDto);
  }

  @Get('/estimate-count')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get all count of all groups',
  })
  async getEstimateCount() {
    return this.groupService.getEstimateCount();
  }

  @RolesAllowed(Roles.ADMIN)
  @UseGuards(JwtAuthGuard, RoleBasedGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete Group' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.groupService.removeById(id);
  }
}
