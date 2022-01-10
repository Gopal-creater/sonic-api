import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MogSchema } from 'mongoose';
import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';
import { SystemGroup } from 'src/constants/Enums';
import { CompanySchemaName } from '../../company/schemas/company.schema';

export const UserSchemaName = 'User';

@Schema({ timestamps: true, collection: UserSchemaName })
export class UserDB extends Document {
  //Store cognito sub value
  @ApiHideProperty()
  @Prop({
    required: true,
    unique: true,
  })
  _id: string;

  //Store cognito username value
  @ApiHideProperty()
  @Prop({
    required: true,
    unique: true,
  })
  username: string;

  //Store cognito sub value
  @ApiHideProperty()
  @Prop({
    required: true,
    unique: true,
  })
  sub: string;

  @ApiProperty()
  @Prop({
    type: [String],
    enum: SystemGroup,
  })
  groups: string[];

  @ApiProperty()
  @Prop()
  email_verified: boolean;

  @ApiProperty()
  @Prop()
  phone_number_verified: boolean;

  @ApiProperty()
  @Prop()
  phone_number: string;

  @ApiProperty()
  @Prop()
  email: string;

  @ApiProperty()
  @Prop({
    type: MogSchema.Types.ObjectId,
    ref: CompanySchemaName,
    autopopulate: true,
  })
  belongsToCompany: any;
}

export const UserSchema = SchemaFactory.createForClass(UserDB);
