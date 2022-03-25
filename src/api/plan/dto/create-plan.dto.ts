import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEnum } from 'class-validator';
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
  availableSonicKeys: number;

  @ApiProperty()
  limitedSonicKeys: number;

  @ApiProperty()
  cost: number;

  @ApiProperty()
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
