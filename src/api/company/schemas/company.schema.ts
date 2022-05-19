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
  companyType: string;

  @ApiProperty()
  @Prop()
  companyUrnOrId: string;

  @ApiProperty()
  @Prop()
  email: string;

  @ApiProperty()
  @Prop()
  contactNo: string;

  @ApiProperty()
  @Prop({default:true})
  enabled: boolean;


  @ApiProperty()
  @Prop({ type: Address })
  address: Address;
  
  @ApiProperty()
  @Prop({
    type: String,
    ref: 'User',
    autopopulate: { maxDepth: 2 },
  })
  owner: any; //Will be admin of this company

  @ApiProperty()
  @Prop({
    type: String,
    ref: 'Partner',
    autopopulate: { maxDepth: 2 },
  })
  partner: any; //Will be parent partner that this company belongs to

  @ApiProperty()
  @Prop()
  createdBy: string;

  @ApiProperty()
  @Prop()
  updatedBy: string;
  
}

export const CompanySchema = SchemaFactory.createForClass(Company);
