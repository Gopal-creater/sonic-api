import { Controller, Get, Post, Body, Param, Res } from '@nestjs/common';
import { ChargebeeService } from '../services/chargebee.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

@ApiTags('Chargebee')
@Controller('chargebee')
export class ChargebeeController {
  constructor(private readonly chargebeeService: ChargebeeService) {}

  @Get('/plans')
  findPlans() {
    return this.chargebeeService.findPlans();
  }

  //Inorder to work with webhook, we need to add this web url into Chargebee webhook setting
  @ApiOperation({ summary: 'Saves the payment to our database.' })
  @Post('/chargebee-webhook')
  async webHook(@Res() response: Response, @Body() data: any) {
    const success = await this.chargebeeService.webhookCheckout(data);
    return response.status(200).send();
  }

  @Get('/plans/:id/get-price')
  getPlanPrice(@Param('id') plan: string) {
    return this.chargebeeService.getPlanPrice(plan);
  }

  @Get('/plans/checkout/:customer_id')
  @ApiOperation({ summary: 'Generates checkout page for new subscription.' })
  getHostedPage(@Param('customer_id') id: string) {
    return this.chargebeeService.getHostedPage_NewSubscription(id);
  }

  @Get('/plans/get-hosted-page-for-addon')
  getHostedPageForAddon() {
    return this.chargebeeService.getHostedPageForAddon();
  }

  @Get('/plans/get-hosted-page-for-upgrade')
  getHostedPageForUpgrade() {
    return this.chargebeeService.getHostedPageForUpgrade();
  }
}
