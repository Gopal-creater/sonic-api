import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MogSchema } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Address } from 'src/api/company/schemas/company.schema';

export const PartnerSchemaName = 'Partner';


@Schema({ timestamps: true, collection: PartnerSchemaName })
export class Partner extends Document {

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
    autopopulate: { maxDepth: 2 },
  })
  owner: any; //Will be admin of this Partner

  @ApiProperty()
  @Prop()
  createdBy: string;

  @ApiProperty()
  @Prop()
  updatedBy: string;
  
}

export const PartnerSchema = SchemaFactory.createForClass(Partner);
