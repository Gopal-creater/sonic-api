import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MogSchema,model } from 'mongoose';
import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';
import { GroupSchemaName } from '../../group/schemas/group.schema';
import { CompanySchemaName } from '../../company/schemas/company.schema';

export const UserSchemaName = 'User';

export class MFAOption{
  @ApiProperty()
  AttributeName:string

  @ApiProperty()
  DeliveryMedium:string
}

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
  @Prop([
    {
      type: MogSchema.Types.ObjectId,
      ref: GroupSchemaName,
      autopopulate: true,
    },
  ])
  groups: any[];

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
  @Prop()
  user_status: string;

  @ApiProperty()
  @Prop()
  enabled: boolean;

  @ApiProperty()
  @Prop([MFAOption])
  mfa_options: MFAOption[];

  @ApiProperty()
  @Prop([{
    type: MogSchema.Types.ObjectId,
    ref: CompanySchemaName,
    autopopulate: true,
  }])
  companies: any[];

  @ApiProperty()
  @Prop({
    type: MogSchema.Types.ObjectId,
    ref: CompanySchemaName,
    autopopulate: true,
  })
  adminCompany: any;
}

export const UserSchema = SchemaFactory.createForClass(UserDB);

export const RawUserModel = model<UserDB>('User',UserSchema)