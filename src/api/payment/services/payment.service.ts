import { Injectable } from '@nestjs/common';
import {
  BrainTreeCustomerDto,
  CreatePaymentDto,
} from '../dto/create-payment.dto';
import { UpdatePaymentDto } from '../dto/update-payment.dto';
import { BraintreeGateway, Environment } from 'braintree';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { Payment } from '../schemas/payment.schema';
import { ParsedQueryDto } from '../../../shared/dtos/parsedquery.dto';
@Injectable()
export class PaymentService {
  brainTreeGateway: BraintreeGateway;
  constructor(
    @InjectModel(Payment.name)
    public readonly paymentModel: Model<Payment>,
    private readonly configService: ConfigService,
  ) {
    this.brainTreeGateway = new BraintreeGateway({
      environment: Environment.Sandbox,
      merchantId: this.configService.get('MERCHANT_ID'),
      publicKey: this.configService.get('PUBLIC_KEY'),
      privateKey: this.configService.get('PRIVATE_KEY'),
    });
  }
  generateClientToken(customerId?: string) {
    const requestObj = {};
    if (customerId) {
      requestObj['customerId'] = customerId;
    }
    return this.brainTreeGateway.clientToken.generate(requestObj);
  }

  create(createPaymentDto: CreatePaymentDto) {
    const { paymentMethodNonce, deviceData, amount } = createPaymentDto;
    this.brainTreeGateway.transaction.sale({
      amount: amount,
      paymentMethodNonce: paymentMethodNonce,
      deviceData: deviceData,
      options: {
        submitForSettlement: true,
      },
    });
  }

  async createTransactionSaleInBrainTree(
    paymentMethodNonce: string,
    amount: string,
    deviceData?: string,
  ) {
    return this.brainTreeGateway.transaction.sale({
      amount: amount,
      paymentMethodNonce: paymentMethodNonce,
      deviceData: deviceData,
      options: {
        submitForSettlement: true,
      },
    });
  }

  /**
   * 
   * @param customer 
   * @param additionalData for additional data please check their official webiste https://developer.paypal.com/braintree/docs/reference/request/customer/create
   * @returns 
   */
  async createCustomerInBrainTree(
    customer:BrainTreeCustomerDto,
    additionalData?:Record<string,any>
  ) {
    return this.brainTreeGateway.customer.create({
      ...customer,
      ...additionalData
    })
  }

  findAll(queryDto: ParsedQueryDto) {
    const { filter } = queryDto;
    return this.paymentModel.find({ ...filter });
  }

  findOne(filter: FilterQuery<Payment>) {
    return this.paymentModel.findOne(filter);
  }

  findById(id: string) {
    return this.paymentModel.findById(id);
  }

  update(id: string, updatePaymentDto: UpdatePaymentDto) {
    return this.paymentModel.findByIdAndUpdate(id, updatePaymentDto);
  }

  async getCount(queryDto: ParsedQueryDto) {
    const { filter } = queryDto;
    return this.paymentModel.find(filter || {}).count();
  }

  async getEstimateCount() {
    return this.paymentModel.estimatedDocumentCount();
  }

  async removeById(id: string) {
    const payment = await this.findById(id);
    return this.paymentModel.findByIdAndRemove(id);
  }
}
