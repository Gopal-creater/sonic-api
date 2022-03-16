import {
  IsArray,
  IsDefined,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, OmitType, PickType } from '@nestjs/swagger';

export class CreatePaymentDto {
  @ApiProperty()
  @IsNotEmpty()
  paymentMethodNonce: string;

  @ApiProperty()
  @IsNotEmpty()
  amount: string;

  @ApiProperty()
  deviceData?: string;
}

export class BrainTreeCustomerDto {
  @ApiProperty()
  id?: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName?: string;

  @ApiProperty()
  company?: string;

  @ApiProperty()
  email?: string;

  @ApiProperty()
  phone?: string;

  @ApiProperty()
  website?: string;
}

export class BuyPlanDto {
  @ApiProperty()
  @IsNotEmpty()
  paymentMethodNonce: string;

  @ApiProperty()
  @IsNotEmpty()
  amount: string;

  @ApiProperty()
  deviceData?: string;

  @ApiProperty()
  @IsNotEmpty()
  plan: string;
}

export class UpgradePlanDto {
  @ApiProperty()
  @IsNotEmpty()
  paymentMethodNonce: string;

  @ApiProperty()
  @IsNotEmpty()
  amount: string;

  @ApiProperty()
  deviceData?: string;

  @ApiProperty()
  @IsNotEmpty()
  oldPlanLicenseKey: string;

  @ApiProperty()
  @IsNotEmpty()
  upgradedPlan: string;
}

export class BuyExtraKeysForExistingPlanDto {
  @ApiProperty()
  @IsNotEmpty()
  paymentMethodNonce: string;

  @ApiProperty()
  @IsNotEmpty()
  amount: string;

  @ApiProperty()
  deviceData?: string;

  @ApiProperty()
  @IsNotEmpty()
  oldPlanLicenseKey: string;

  @ApiProperty()
  @IsNotEmpty()
  extraKeys: number;
}
