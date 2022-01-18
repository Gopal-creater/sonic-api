import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MogSchema } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { CompanySchemaName } from '../../company/schemas/company.schema';

export const UserCompanySchemaName = 'UserCompany';

@Schema({ timestamps: true, collection: UserCompanySchemaName })
export class UserCompany extends Document {

  @ApiProperty()
  @Prop({
    type: MogSchema.Types.ObjectId,
    ref: CompanySchemaName,
    autopopulate: true,
    required: true,
  })
  company: any;

  @ApiProperty()
  @Prop({
    type: MogSchema.Types.Boolean,
    default: false,
  })
  isAdmin: boolean;
}

export const UserCompanySchema = SchemaFactory.createForClass(UserCompany);
