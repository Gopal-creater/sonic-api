import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ChargeBeeDocument = ChargeBee & Document;

@Schema()
export class ChargeBee {
  @Prop({ required: true })
  customerId: string;

  @Prop({ required: true })
  paymentId: string;
}

export const ChargeBeeSchema = SchemaFactory.createForClass(ChargeBee);
