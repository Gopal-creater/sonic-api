import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { ChargebeeService } from './chargebee.service';
import { CreateChargebeeDto } from './dto/create-chargebee.dto';
import { UpdateChargebeeDto } from './dto/update-chargebee.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Chargebee')
@Controller('chargebee')
export class ChargebeeController {
  constructor(private readonly chargebeeService: ChargebeeService) {}

  @Get('/plans')
  findPlans() {
    return this.chargebeeService.findPlans();
  }

  //Inorder to work with webhook, we need to add this web url into Chargebee webhook setting
  @Post('/webhook')
  webHook(@Body() data:any) {
    console.log("data",data)
    return "done"
  }

  @Get('/plans/:id/get-price')
  getPlanPrice(@Param('id') plan: string) {
    return this.chargebeeService.getPlanPrice(plan);
  }

  @Get('/plans/get-hosted-page')
  getHostedPage() {
    return this.chargebeeService.getHostedPage();
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
