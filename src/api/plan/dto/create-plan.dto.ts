import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEnum, IsInt } from 'class-validator';
import { PlanName, PlanType } from 'src/constants/Enums';

export class CreatePlanDto {
  @IsNotEmpty()
  @IsEnum(PlanName)
  @ApiProperty({
    enum: PlanName,
  })
  name: PlanName;

  @IsNotEmpty()
  @IsEnum(PlanType)
  @ApiProperty({
    enum: PlanType,
  })
  type: PlanType;

  @ApiProperty()
  description: string;

  @ApiProperty()
  @IsInt()
  availableSonicKeys: number;

  @ApiProperty()
  @IsInt()
  limitedSonicKeys: number;

  @ApiProperty()
  @IsInt()
  cost: number;

  @ApiProperty()
  @IsInt()
  perExtraCost: number;

  @ApiProperty()
  paymentInterval: string;

  @ApiProperty()
  notes: string;
}

export class BuyPlanDto {
  @ApiProperty()
  paymentMethodNonce: string;

  @ApiProperty()
  transactionId: string;

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
  paymentMethodNonce: string;

  @ApiProperty()
  transactionId: string;

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
  paymentMethodNonce: string;

  @ApiProperty()
  transactionId: string;

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
  @IsInt()
  extraKeys: number;
}
