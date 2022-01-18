import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MogSchema } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { UserSchemaName } from '../../user/schemas/user.db.schema';

export const GroupSchemaName = 'Group';

@Schema({ timestamps: true, collection: GroupSchemaName })
export class Group extends Document {

  @ApiProperty()
  @Prop({
    required: true
  })
  name: string;

  @ApiProperty()
  @Prop()
  description: string;

  @ApiProperty()
  @Prop()
  contactNo: string;

  @ApiProperty()
  @Prop()
  address: string;

  @ApiProperty()
  @Prop()
  createdBy: string;

  @ApiProperty()
  @Prop()
  updatedBy: string;

  // @ApiProperty()
  // @Prop()
  // company: string;
  
}

export const GroupSchema = SchemaFactory.createForClass(Group);
