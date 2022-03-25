import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MogSchema } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export const PaymentSchemaName = 'Payment';

@Schema({ timestamps: true, collection: PaymentSchemaName })
export class Payment extends Document {
  @ApiProperty()
  @Prop({
    required: true,
  })
  amount: string;

  @ApiProperty()
  @Prop()
  paymentMethodNonce: string;

  @ApiProperty()
  @Prop()
  deviceData: string;

  @ApiProperty()
  @Prop()
  braintreeTransactionId: string;

  @ApiProperty()
  @Prop({type:MogSchema.Types.ObjectId})
  braintreeTransactionResult: any;

  @ApiProperty()
  @Prop()
  braintreeTransactionStatus: string;

  @ApiProperty()
  @Prop({
    type: String,
    ref: 'User',
    required: true,
    autopopulate: { maxDepth: 2 },
  })
  user: any;

  @ApiProperty()
  @Prop({
    type: MogSchema.Types.ObjectId,
    ref: 'Plan',
    autopopulate: { maxDepth: 2 },
  })
  plan: any;

  @ApiProperty()
  @Prop({
    type: String,
    ref: 'LicenseKey',
    autopopulate: { maxDepth: 2 },
  })
  licenseKey: any;

  @ApiProperty()
  @Prop()
  notes: string;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
