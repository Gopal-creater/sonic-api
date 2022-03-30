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

  /**
   * Response Data
   * paymentResponse {
  transaction: Transaction {
    id: '0dq91dzn',
    status: 'submitted_for_settlement',
    type: 'sale',
    currencyIsoCode: 'USD',
    amount: '9.99',
    amountRequested: '9.99',
    merchantAccountId: 'arbadev',
    subMerchantAccountId: null,
    masterMerchantAccountId: null,
    orderId: null,
    createdAt: '2022-03-18T07:39:18Z',
    updatedAt: '2022-03-18T07:39:18Z',
    customer: {
      id: null,
      firstName: null,
      lastName: null,
      company: null,
      email: null,
      website: null,
      phone: null,
      fax: null
    },
    billing: {
      id: null,
      firstName: null,
      lastName: null,
      company: null,
      streetAddress: null,
      extendedAddress: null,
      locality: null,
      region: null,
      postalCode: null,
      countryName: null,
      countryCodeAlpha2: null,
      countryCodeAlpha3: null,
      countryCodeNumeric: null
    },
    refundId: null,
    refundIds: [],
    refundedTransactionId: null,
    partialSettlementTransactionIds: [],
    authorizedTransactionId: null,
    settlementBatchId: null,
    shipping: {
      id: null,
      firstName: null,
      lastName: null,
      company: null,
      streetAddress: null,
      extendedAddress: null,
      locality: null,
      region: null,
      postalCode: null,
      countryName: null,
      countryCodeAlpha2: null,
      countryCodeAlpha3: null,
      countryCodeNumeric: null
    },
    customFields: '',
    accountFundingTransaction: false,
    avsErrorResponseCode: null,
    avsPostalCodeResponseCode: 'I',
    avsStreetAddressResponseCode: 'I',
    cvvResponseCode: 'M',
    gatewayRejectionReason: null,
    processorAuthorizationCode: 'V0NJPG',
    processorResponseCode: '1000',
    processorResponseText: 'Approved',
    additionalProcessorResponse: null,
    voiceReferralNumber: null,
    purchaseOrderNumber: null,
    taxAmount: null,
    taxExempt: false,
    scaExemptionRequested: null,
    processedWithNetworkToken: false,
    creditCard: CreditCard {
      token: null,
      bin: '411111',
      last4: '1111',
      cardType: 'Visa',
      expirationMonth: '11',
      expirationYear: '2023',
      customerLocation: 'US',
      cardholderName: 'Visa',
      imageUrl: 'https://assets.braintreegateway.com/payment_method_logo/visa.png?environment=sandbox',
      prepaid: 'Unknown',
      healthcare: 'Unknown',
      debit: 'Unknown',
      durbinRegulated: 'Unknown',
      commercial: 'Unknown',
      payroll: 'Unknown',
      issuingBank: 'Unknown',
      countryOfIssuance: 'Unknown',
      productId: 'Unknown',
      globalId: null,
      graphQLId: null,
      accountType: 'credit',
      uniqueNumberIdentifier: null,
      venmoSdk: false,
      accountBalance: null,
      maskedNumber: '411111******1111',
      expirationDate: '11/2023'
    },
    statusHistory: [ [Object], [Object] ],
    planId: null,
    subscriptionId: null,
    subscription: { billingPeriodEndDate: null, billingPeriodStartDate: null },
    addOns: [],
    discounts: [],
    descriptor: { name: null, phone: null, url: null },
    recurring: false,
    channel: null,
    serviceFeeAmount: null,
    escrowStatus: null,
    disbursementDetails: DisbursementDetails {
      disbursementDate: null,
      settlementAmount: null,
      settlementCurrencyIsoCode: null,
      settlementCurrencyExchangeRate: null,
      settlementBaseCurrencyExchangeRate: null,
      fundsHeld: null,
      success: null
    },
    disputes: [],
    authorizationAdjustments: [],
    paymentInstrumentType: 'credit_card',
    processorSettlementResponseCode: '',
    processorSettlementResponseText: '',
    networkResponseCode: 'XX',
    networkResponseText: 'sample network response text',
    threeDSecureInfo: null,
    shipsFromPostalCode: null,
    shippingAmount: null,
    discountAmount: null,
    networkTransactionId: '020220318073918',
    processorResponseType: 'approved',
    authorizationExpiresAt: '2022-03-25T07:39:18Z',
    retryIds: [],
    retried: false,
    retriedTransactionId: null,
    refundGlobalIds: [],
    partialSettlementTransactionGlobalIds: [],
    refundedTransactionGlobalId: null,
    authorizedTransactionGlobalId: null,
    globalId: 'dHJhbnNhY3Rpb25fMGRxOTFkem4',
    graphQLId: 'dHJhbnNhY3Rpb25fMGRxOTFkem4',
    retryGlobalIds: [],
    retriedTransactionGlobalId: null,
    retrievalReferenceNumber: '1234567',
    installmentCount: null,
    installments: [],
    refundedInstallments: [],
    responseEmvData: null,
    acquirerReferenceNumber: null,
    merchantIdentificationNumber: '123456789012',
    terminalIdentificationNumber: '00000001',
    merchantName: 'DESCRIPTORNAME',
    merchantAddress: {
      streetAddress: '',
      locality: 'Braintree',
      region: 'MA',
      postalCode: '02184',
      phone: '5555555555'
    },
    pinVerified: false,
    debitNetwork: null,
    processingMode: null,
    paymentReceipt: {
      id: '0dq91dzn',
      globalId: 'dHJhbnNhY3Rpb25fMGRxOTFkem4',
      amount: '9.99',
      currencyIsoCode: 'USD',
      processorResponseCode: '1000',
      processorResponseText: 'Approved',
      processorAuthorizationCode: 'V0NJPG',
      merchantName: 'DESCRIPTORNAME',
      merchantAddress: [Object],
      merchantIdentificationNumber: '123456789012',
      terminalIdentificationNumber: '00000001',
      type: 'sale',
      pinVerified: false,
      processingMode: null,
      networkIdentificationCode: null,
      cardType: 'Visa',
      cardLast4: '1111'
    },
    paypalAccount: PayPalAccount {},
    paypalHereDetails: PayPalHereDetails {},
    localPayment: LocalPayment {},
    applePayCard: ApplePayCard {},
    androidPayCard: AndroidPayCard {},
    visaCheckoutCard: VisaCheckoutCard {},
    samsungPayCard: SamsungPayCard {},
    [Symbol()]: BraintreeGateway {
      config: [Config],
      graphQLClient: [GraphQLClient],
      http: [Http],
      addOn: [AddOnGateway],
      address: [AddressGateway],
      clientToken: [ClientTokenGateway],
      creditCard: [CreditCardGateway],
      creditCardVerification: [CreditCardVerificationGateway],
      customer: [CustomerGateway],
      disbursement: [DisbursementGateway],
      discount: [DiscountGateway],
      dispute: [DisputeGateway],
      documentUpload: [DocumentUploadGateway],
      merchantAccount: [MerchantAccountGateway],
      merchant: [MerchantGateway],
      oauth: [OAuthGateway],
      paymentMethod: [PaymentMethodGateway],
      paymentMethodNonce: [PaymentMethodNonceGateway],
      paypalAccount: [PayPalAccountGateway],
      plan: [PlanGateway],
      settlementBatchSummary: [SettlementBatchSummaryGateway],
      subscription: [SubscriptionGateway],
      testing: [TestingGateway],
      transaction: [TransactionGateway],
      transactionLineItem: [TransactionLineItemGateway],
      usBankAccount: [UsBankAccountGateway],
      usBankAccountVerification: [UsBankAccountVerificationGateway],
      webhookNotification: [WebhookNotificationGateway],
      webhookTesting: [WebhookTestingGateway]
    }
  },
  success: true
}
   * @param createPaymentDto 
   * @returns 
   */
  create(createPaymentDto: CreatePaymentDto) {
    const { paymentMethodNonce, deviceData, amount } = createPaymentDto;
    return this.brainTreeGateway.transaction.sale({
      amount: amount,
      merchantAccountId:"Pound",
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
      merchantAccountId:"Pound",
      deviceData: deviceData,
      options: {
        submitForSettlement: true,
      },
    });
  }

  async getTransactionById(
    transactionId: string,
  ): Promise<braintree.Transaction> {
    return this.brainTreeGateway.transaction
      .find(transactionId)
      .catch(err => Promise.resolve(null));
  }

  /**
   *
   * @param customer
   * @param additionalData for additional data please check their official webiste https://developer.paypal.com/braintree/docs/reference/request/customer/create
   * @returns
   */
  async createCustomerInBrainTree(
    customer: BrainTreeCustomerDto,
    additionalData?: Record<string, any>,
  ) {
    return this.brainTreeGateway.customer.create({
      ...customer,
      ...additionalData,
    });
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
