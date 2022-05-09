import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MogSchema,model } from 'mongoose';
import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';
import { GroupSchemaName } from '../../group/schemas/group.schema';
import { AccountTypes, SystemGroup, UserType } from 'src/constants/Enums';

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

  @ApiHideProperty()
  @Prop()
  name: string;

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
      autopopulate: { maxDepth: 2 },
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
  country: string;

  @ApiProperty()
  @Prop()
  user_status: string;

  @ApiProperty()
  @Prop()
  enabled: boolean;

  @ApiProperty()
  @Prop({default:false})
  isSonicAdmin: boolean;

  @ApiProperty()
  @Prop({type:String,enum:AccountTypes,default:AccountTypes.PORTAL_USER})
  accountType?: string;

  @ApiProperty()
  @Prop([MFAOption])
  mfa_options: MFAOption[];

  @ApiProperty()
  @Prop([{
    type: MogSchema.Types.ObjectId,
    ref: 'Company',
    autopopulate: { maxDepth: 2 },
  }])
  companies: any[];

  @ApiProperty()
  @Prop({
    type: MogSchema.Types.ObjectId,
    ref: 'Company',
    autopopulate: { maxDepth: 2 },
  })
  company: any; //Where user is belongs To

  @ApiProperty()
  @Prop({
    type: MogSchema.Types.ObjectId,
    ref: 'Partner',
    autopopulate: { maxDepth: 2 },
  })
  partner: any; //Where user is belongs To

  @ApiProperty()
  @Prop({
    type: MogSchema.Types.ObjectId,
    ref: 'Company',
    autopopulate: { maxDepth: 2 },
  })
  adminCompany: any; //Admin of this company

  @ApiProperty()
  @Prop({
    type: MogSchema.Types.ObjectId,
    ref: 'Partner',
    autopopulate: { maxDepth: 2 },
  })
  adminPartner: any; //Admin of this partner
}

export const UserSchema = SchemaFactory.createForClass(UserDB);

export const RawUserModel = model<UserDB>('User',UserSchema)
