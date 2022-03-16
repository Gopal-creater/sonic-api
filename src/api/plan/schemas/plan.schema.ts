import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MogSchema } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { PaymentInterval, PlanName, PlanType } from 'src/constants/Enums';

export const PlanSchemaName = 'Plan';

@Schema({ timestamps: true, collection: PlanSchemaName })
export class Plan extends Document {
  @ApiProperty()
  @Prop({ type: String, enum: PlanName, required: true })
  name: string;

  @ApiProperty()
  @Prop({ type: String, enum: PlanType,default:'Encode', required: true })
  type: string;

  @ApiProperty()
  @Prop()
  description: string;

  @ApiProperty()
  @Prop()
  availableSonicKeys: number;

  @ApiProperty()
  @Prop()
  limitedSonicKeys: number;

  @ApiProperty()
  @Prop({required:true})
  cost: number;

  @ApiProperty()
  @Prop()
  perExtraCost: number;

  @ApiProperty()
  @Prop({ type: String, enum: PaymentInterval,default:'Annual'})
  paymentInterval: string;

  @ApiProperty()
  @Prop()
  notes: string;
}

export const PlanSchema = SchemaFactory.createForClass(Plan);
