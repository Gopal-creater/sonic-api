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

  @Get('generate-client-token')
  findAll() {
    return this.paymentService.generateClientToken();
  }

  @Post('/create-transaction')
  async create(@Body() createPaymentDto: CreatePaymentDto) {
    const paymentResponse = await this.paymentService.create(createPaymentDto);
    console.log("paymentResponse",paymentResponse)
    return paymentResponse
  }
}
