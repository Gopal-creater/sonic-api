import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MogSchema } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export const CompanySchemaName = 'Company';

@Schema()
export class Address {
  @ApiProperty()
  country: string;

  @ApiProperty()
  city: string;

  @ApiProperty()
  line1: string;

  @ApiProperty()
  line2: string;
}

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
  email: string;

  @ApiProperty()
  @Prop()
  contactNo: string;


  @ApiProperty()
  @Prop({ type: Address })
  address: Address;
  
  @ApiProperty()
  @Prop({
    type: String,
    ref: 'User',
    autopopulate: true,
  })
  owner: any;
  
}

export const CompanySchema = SchemaFactory.createForClass(Company);
