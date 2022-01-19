import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { CreateGroupDto } from './dtos/create-group.dto';
import { UpdateGroupDto } from './dtos/update-group.dto';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { Group } from './schemas/group.schema';
import { SystemGroup } from 'src/constants/Enums';
import { UserService } from '../user/services/user.service';
import { ParsedQueryDto } from 'src/shared/dtos/parsedquery.dto';

@Injectable()
export class GroupService {
  constructor(
    @InjectModel(Group.name)
    public readonly groupModel: Model<Group>,

    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService
  ) {}
  async create(createGroupDto: CreateGroupDto) {
    const{name}=createGroupDto
    const newGroup = await this.groupModel.create(createGroupDto);
    const groupDb = await newGroup.save();
    //Once saved to db , also save it to cognito
    await this.userService.cognitoCreateGroup(name).catch(err=>console.warn("Warning: Error creating cognito group",err))
    return groupDb
  }

  findAll() {
    return this.groupModel.find();
  }

  findOne(filter:FilterQuery<Group>) {
    return this.groupModel.findOne(filter);
  }

  findById(id:string) {
    return this.groupModel.findById(id);
  }

  async getCount(queryDto: ParsedQueryDto) {
    const { filter, includeGroupData } = queryDto;
    return this.groupModel
      .find(filter || {})
      .count()
  }

  async getEstimateCount() {
    return this.groupModel.estimatedDocumentCount()
  }

  update(id: string, updateGroupDto: UpdateGroupDto) {
    return this.groupModel.findByIdAndUpdate(id, updateGroupDto);
  }

  async removeById(id: string) {
    const group = await this.findById(id)
    const deletedGroup = await this.groupModel.findByIdAndRemove(id)
    await this.userService.cognitoDeleteGroup(group.name).catch(err=>console.warn("Warning: Error deleting cognito group",err))
    return deletedGroup
  }

  async createDefaultGroups() {
    const defaultGroups = Object.values(SystemGroup);
    for await (const grp of defaultGroups) {
      await this.groupModel.findOneAndUpdate(
        {
          name: grp,
        },
        { name: grp },
        { upsert: true },
      );
    }
    return {
      message:"Created default groups",
      success:true
    }
  }
}
