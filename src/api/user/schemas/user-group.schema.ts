import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MogSchema } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { GroupSchemaName } from '../../group/schemas/group.schema';

export const UserGroupSchemaName = 'UserGroup';

@Schema({ timestamps: true, collection: UserGroupSchemaName })
export class UserGroup extends Document {
  @ApiProperty()
  @Prop({
    type: MogSchema.Types.ObjectId,
    ref: GroupSchemaName,
    autopopulate: true,
    required:true
  })
  group: any;
}

export const UserGroupSchema = SchemaFactory.createForClass(UserGroup);
