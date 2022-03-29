import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  UseGuards,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PaymentService } from '../../payment/services/payment.service';
import {
  UpgradePlanDto,
  BuyPlanDto,
  BuyExtraKeysForExistingPlanDto,
} from '../dto/create-plan.dto';
import { ApiQuery, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { PlanService } from '../plan.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { User } from '../../auth/decorators/user.decorator';
import { LicensekeyService } from '../../licensekey/services/licensekey.service';
import { Plan } from 'src/api/plan/schemas/plan.schema';
import { PlanType } from 'src/constants/Enums';
import { ParseQueryValue } from '../../../shared/pipes/parseQueryValue.pipe';
import { ParsedQueryDto } from '../../../shared/dtos/parsedquery.dto';

@ApiTags('Plans Controller')
@Controller('plans/owners/:ownerId')
export class PlansOwnerController {
  constructor(
    private readonly planService: PlanService,
    private readonly licenseKeyService: LicensekeyService,
  ) {
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('/my-plans')
  async myPlans(
    @User('sub') user: string,
    @Param('ownerId') ownerId: string,
    @Query(new ParseQueryValue()) queryDto?: ParsedQueryDto,
  ) {
    return this.planService.fetchMyPlans(user, queryDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('/buy-plan')
  async buyPlan(
    @Body() buyPlanDto: BuyPlanDto,
    @User('sub') user: string,
    @Param('ownerId') ownerId: string,
  ) {
    const { plan } = buyPlanDto;
    const planFromDb = await this.planService.findById(plan);
    if (!planFromDb) {
      throw new NotFoundException('Invalid plan selected, Plan not found');
    }
    const isSamePlan = await this.licenseKeyService.findOne({
      users: user,
      activePlan: plan,
    });
    if (isSamePlan) {
      throw new BadRequestException('Can not select your active plan');
    }

    return this.planService.buyPlan(user, buyPlanDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Put('/upgrade-plan')
  async upgradePlan(
    @Body() upgradePlanDto: UpgradePlanDto,
    @User('sub') user: string,
    @Param('ownerId') ownerId: string,
  ) {
    const { upgradedPlan,oldPlanLicenseKey } = upgradePlanDto;
    const upgradedPlanFromDb = await this.planService.findById(upgradedPlan);
    if (!upgradedPlanFromDb) {
      throw new NotFoundException('Invalid plan selected, Plan not found');
    }
    const isSamePlan = await this.licenseKeyService.findOne({
      users: user,
      activePlan: upgradedPlan,
    });
    if (isSamePlan) {
      throw new BadRequestException('Can not select your active plan');
    }
    const planLicenseKey = await this.licenseKeyService.findOne({users:user,key:oldPlanLicenseKey})
    if (!planLicenseKey) {
      throw new NotFoundException(`Your current plan is not found with given id ${oldPlanLicenseKey}`);
    }
    return this.planService.upgradePlan(user, upgradePlanDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Put('/buy-extra-sonickeys')
  async buyExtraKeys(
    @Body() buyExtraKeysForExistingPlanDto: BuyExtraKeysForExistingPlanDto,
    @User('sub') user: string,
    @Param('ownerId') ownerId: string,
  ) {
    const { oldPlanLicenseKey, extraKeys } = buyExtraKeysForExistingPlanDto;
    const oldPlanLicenseKeyFromDb = await this.licenseKeyService.findOne({
      key: oldPlanLicenseKey,
    });
    if (!oldPlanLicenseKeyFromDb) {
      throw new NotFoundException(
        'Invalid old plan selected, Old plan not found',
      );
    }
    const activePlan = oldPlanLicenseKeyFromDb?.activePlan as Plan;
    if (activePlan.type !== PlanType.ENCODE) {
      throw new NotFoundException(
        'Invalid old plan selected, Old plan not found',
      );
    }
    if (
      (oldPlanLicenseKeyFromDb.maxEncodeUses -
        oldPlanLicenseKeyFromDb.oldMaxEncodeUses || 0) +
        extraKeys >
      activePlan.limitedSonicKeys
    ) {
      throw new BadRequestException(
        `Maximum sonickeys limit reached on this plan,available limit value is : ${activePlan.limitedSonicKeys -
          (oldPlanLicenseKeyFromDb.maxEncodeUses -
            oldPlanLicenseKeyFromDb.oldMaxEncodeUses || 0)}`,
      );
    }

    return this.planService.buyExtraKeysForPlan(
      user,
      buyExtraKeysForExistingPlanDto,
    );
  }
}
