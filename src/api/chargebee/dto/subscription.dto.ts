import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class SubscriptionDto {
  @IsNotEmpty()
  customerId: string;

  @IsEmail()
  customerEmail: string;
}
