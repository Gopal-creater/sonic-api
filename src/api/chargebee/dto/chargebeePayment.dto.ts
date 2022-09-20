import { IsNotEmpty } from 'class-validator';

export class ChargebeePaymentDto {
  @IsNotEmpty()
  customerId: string;

  @IsNotEmpty()
  paymentId: string;
}
