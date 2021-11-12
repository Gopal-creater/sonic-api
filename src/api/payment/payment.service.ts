import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import {BraintreeGateway,Environment} from 'braintree'
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PaymentService {
  brainTreeGateway:BraintreeGateway
  constructor(private readonly configService: ConfigService){
    this.brainTreeGateway = new BraintreeGateway({
      environment: Environment.Sandbox,
      merchantId: this.configService.get('MERCHANT_ID'),
      publicKey: this.configService.get('PUBLIC_KEY'),
      privateKey: this.configService.get('PRIVATE_KEY')
    });
  }
  generateClientToken(customerId?:string){
    const requestObj = {}
    if(customerId){
      requestObj["customerId"]=customerId
    }
    return this.brainTreeGateway.clientToken.generate(requestObj)
  }

  create(createPaymentDto: CreatePaymentDto) {
    return 'This action adds a new payment';
  }

  findAll() {
    return `This action returns all payment`;
  }

  findOne(id: number) {
    return `This action returns a #${id} payment`;
  }

  update(id: number, updatePaymentDto: UpdatePaymentDto) {
    return `This action updates a #${id} payment`;
  }

  remove(id: number) {
    return `This action removes a #${id} payment`;
  }
}
