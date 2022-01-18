import { Injectable,Inject,forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDB, UserSchemaName } from '../schemas/user.db.schema';
import { Group } from 'src/api/group/schemas/group.schema';
import { GroupService } from '../../group/group.service';
import { UserService } from './user.service';

@Injectable()
export class UserGroupService {
  constructor(
    @Inject(forwardRef(()=>UserService))
    public readonly userService: UserService,
    public readonly groupService: GroupService,
    @InjectModel(UserSchemaName)
    public readonly userModel: Model<UserDB>,
  ) {}

  async addUserToGroup(user: UserDB, group: Group) {
    // Also add it in the cognito
    await this.userService.adminAddUserToGroup(user.username,group.name)
    .catch(err=>console.warn("Warning: Error adding user to cognito group",err))
    const alreadyInGroup = await this.userModel.findOne({
      _id: user.id,
      groups: {$in:[group._id]},
    });
    if (alreadyInGroup) {
      return alreadyInGroup;
    }
    return this.userModel.findOneAndUpdate(
      { _id: user.id },
      {
        $push: {
          groups: group,
        },
      },
      {
        new: true,
      },
    );
  }

  async addUserToGroups(user: UserDB, groups: Group[]) {
    var updatedUser = user;
    for await (const group of groups) {
      updatedUser = await this.addUserToGroup(user, group);
    }
    return updatedUser;
  }

  async removeUserFromGroup(user: UserDB, group: Group) {
      //Also remove user from cognito group
    await this.userService.adminRemoveUserFromGroup(user.username,group.name)
    .catch(err=>console.warn("Warning: Error removing user from cognito group",err))
    return this.userModel.findOneAndUpdate(
      { _id: user.id },
      {
        $pull: {
          groups: group,
        },
      },
      {
        new: true,
      },
    );
  }

  async removeUserFromGroups(user: UserDB, groups: Group[]) {
    var updatedUser = user;
    for await (const group of groups) {
      updatedUser = await this.removeUserFromGroup(user, group);
    }
    return updatedUser;
  }

  async listAllGroupsForUser(user: UserDB): Promise<Group[]> {
    const userWithGroups = await this.userModel.findById(user.id);
    return userWithGroups.groups;
  }
}
