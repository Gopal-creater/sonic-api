import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MogSchema } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { UserSchemaName } from '../../user/schemas/user.db.schema';

export const CompanySchemaName = 'Company';

@Schema({ timestamps: true, collection: CompanySchemaName })
export class Company extends Document {

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

  owner: string;
  
}

export const CompanySchema = SchemaFactory.createForClass(Company);
