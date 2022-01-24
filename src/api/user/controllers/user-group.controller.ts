import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
} from '@nestjs/swagger';
import {
  AddUserToGroupDto,
  RemoveUserFromGroupDto,
} from '../dtos/index';
import { UserService } from '../services/user.service';
import {
  Controller,
  Get,
  Param,
  Post,
  Put,
  Body,
  UseGuards,
  Delete,
  BadRequestException,
} from '@nestjs/common';
import { RolesAllowed } from '../../auth/decorators/roles.decorator';
import { Roles } from 'src/constants/Enums';
import { RoleBasedGuard } from '../../auth/guards/role-based.guard';
import { UserGroupService } from '../services/user-group.service';
import { GroupService } from '../../group/group.service';

@ApiTags('User Controller')
@Controller('users')
export class UserGroupController {
  constructor(
    private readonly userServices: UserService,
    private readonly groupService: GroupService,
    private readonly userGroupService: UserGroupService,
  ) {}

  @RolesAllowed(Roles.ADMIN)
  @UseGuards(JwtAuthGuard,RoleBasedGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'add user to group' })
  @Post('/groups/add-user-to-group')
  async addUserToGroup(@Body() addUserToGroupDto: AddUserToGroupDto) {
    const { user, group } = addUserToGroupDto;
    const validUser = await this.userServices.findById(user)
    const validGroup = await this.groupService.findById(group)
    if(!validUser){
      throw new BadRequestException("Invalid user")
    }
    if(!validGroup){
      throw new BadRequestException("Invalid group")
    }
    return this.userGroupService.addUserToGroup(validUser, validGroup);
  }

  @RolesAllowed(Roles.ADMIN)
  @UseGuards(JwtAuthGuard,RoleBasedGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'remove user from group' })
  @Delete('/groups/remove-user-from-group')
  async removeUserFromGroup(
    @Body() removeUserFromGroupDto: RemoveUserFromGroupDto,
  ) {
    const { user, group } = removeUserFromGroupDto;
    const validUser = await this.userServices.findById(user)
    const validGroup = await this.groupService.findById(group)
    if(!validUser){
      throw new BadRequestException("Invalid user")
    }
    if(!validGroup){
      throw new BadRequestException("Invalid group")
    }
    return this.userGroupService.removeUserFromGroup(validUser, validGroup);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'list groups of particular user' })
  @Get('/groups/list-groups/:user')
  async listAllGroupsForUser(@Param('user') user: string) {
    const validUser = await this.userServices.findById(user)
    if(!validUser){
      throw new BadRequestException("Invalid user")
    }
    return this.userGroupService.listAllGroupsForUser(validUser);
  }
}
