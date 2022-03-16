import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  NotFoundException
} from '@nestjs/common';
import { PaymentService } from '../services/payment.service';
import { CreatePaymentDto,BuyPlanDto } from '../dto/create-payment.dto';
import { UpdatePaymentDto } from '../dto/update-payment.dto';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { PlanService } from '../../plan/plan.service';

@ApiTags("Payment Gateway Controller")
@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @ApiQuery({name:'customerId',required:false})
  @Get('generate-client-token')
  findAll(@Query('customerId') customerId: string) {
    return this.paymentService.generateClientToken(customerId);
  }

  @Post('/create-transaction')
  create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentService.create(createPaymentDto);
  }
}
