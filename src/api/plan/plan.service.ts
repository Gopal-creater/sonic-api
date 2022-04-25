import { Injectable, Inject, forwardRef, NotFoundException, BadRequestException } from '@nestjs/common';
import {
  CreatePlanDto,
  BuyPlanDto,
  UpgradePlanDto,
  BuyExtraKeysForExistingPlanDto,
  RenewPlanDto,
} from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { Plan } from './schemas/plan.schema';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import {
  PlanName,
  PlanType,
  PaymentInterval,
  ApiKeyType,
} from 'src/constants/Enums';
import { ParsedQueryDto } from '../../shared/dtos/parsedquery.dto';
import { PaymentService } from '../payment/services/payment.service';
import { LicensekeyService } from '../licensekey/services/licensekey.service';
import { LicenseKey } from 'src/api/licensekey/schemas/licensekey.schema';

@Injectable()
export class PlanService {
  constructor(
    @InjectModel(Plan.name)
    public readonly planModel: Model<Plan>,
    @Inject(forwardRef(() => PaymentService))
    private readonly paymentService: PaymentService,
    @Inject(forwardRef(() => LicensekeyService))
    private readonly licenseKeyService: LicensekeyService,
  ) {}
  async create(createPlanDto: CreatePlanDto) {
    const newPlan = await this.planModel.create(createPlanDto);
    return newPlan.save();
  }

  findAll(queryDto: ParsedQueryDto) {
    const { filter } = queryDto;
    return this.planModel.find({ ...filter });
  }

  findOne(filter: FilterQuery<Plan>) {
    return this.planModel.findOne(filter);
  }

  findById(id: string) {
    return this.planModel.findById(id);
  }

  update(id: string, updatePlanDto: UpdatePlanDto) {
    return this.planModel.findByIdAndUpdate(id, updatePlanDto);
  }

  async getCount(queryDto: ParsedQueryDto) {
    const { filter } = queryDto;
    return this.planModel.find(filter || {}).count();
  }

  async getEstimateCount() {
    return this.planModel.estimatedDocumentCount();
  }

  async removeById(id: string) {
    const plan = await this.findById(id);
    return this.planModel.findByIdAndRemove(id);
  }

  async createDefaultPlans() {
    //Basic Encode Plan
    await this.planModel.findOneAndUpdate(
      {
        name: PlanName.BASIC,
        type: PlanType.ENCODE,
      },
      {
        name: PlanName.BASIC,
        type: PlanType.ENCODE,
        description: 'encode a songs',
        availableSonicKeys: 10,
        limitedSonicKeys: 100,
        cost: 9.99,
        perExtraCost: 0.99,
        paymentInterval: PaymentInterval.ANNUAL,
        featureLists: [
          "10 SonicKeys available",
          "£0.99 per extra SonicKey",
          "Limited to 100 SonicKeys total"
      ]
      },
      { upsert: true },
    );
    //Standard Encode Plan
    await this.planModel.findOneAndUpdate(
      {
        name: PlanName.STANDARD,
        type: PlanType.ENCODE,
      },
      {
        name: PlanName.STANDARD,
        type: PlanType.ENCODE,
        description: 'encode a songs',
        availableSonicKeys: 50,
        limitedSonicKeys: 100,
        cost: 39.99,
        perExtraCost: 0.99,
        paymentInterval: PaymentInterval.ANNUAL,
        featureLists:[
          "50 SonicKeys available",
          "£0.99 per extra SonicKey",
          "Limited to 100 SonicKeys total"
      ]
      },
      { upsert: true },
    );
    //Premium Encode Plan
    await this.planModel.findOneAndUpdate(
      {
        name: PlanName.PREMIUM,
        type: PlanType.ENCODE,
      },
      {
        name: PlanName.PREMIUM,
        type: PlanType.ENCODE,
        description: 'encode a songs, for extra keys contact admin',
        availableSonicKeys: 100,
        limitedSonicKeys: null,
        cost: 69.99,
        perExtraCost: 0.99,
        paymentInterval: PaymentInterval.ANNUAL,
        featureLists:[
          "100 SonicKeys available"
      ]
      },
      { upsert: true },
    );
    return {
      message: 'Created default plans',
      success: true,
    };
  }

  /**
   * This will do followings,
   * Do payment in braintree
   * Save payment details in our db with user and plan details
   * Create License From Plan and update payment with newly created license key
   * @param user
   * @param createSubscriptionDto
   * @returns
   */
  async buyPlan(user: string, buyPlanDto: BuyPlanDto) {
    const {
      amount,
      paymentMethodNonce,
      transactionId,
      deviceData,
      plan,
    } = buyPlanDto;
    var brainTreeTransactionResponse: braintree.Transaction;
    if (!transactionId && paymentMethodNonce) {
      //Braintree transaction
      const createdSale = await this.paymentService.createTransactionSaleInBrainTree(
        paymentMethodNonce,
        amount,
        deviceData,
      ).catch(err=>{
        throw new BadRequestException(err)
      })
      if(!createdSale.success){
        throw new BadRequestException(`Transaction Failed : ${createdSale?.transaction?.status}`)
      }
      brainTreeTransactionResponse = createdSale.transaction;
    } else if (transactionId) {
      brainTreeTransactionResponse = await this.paymentService.getTransactionById(
        transactionId,
      );
    }
    if(!brainTreeTransactionResponse){
      throw new NotFoundException("Invalid transaction")
    }

    //Save  Payment info
    const newPaymentInDb = await this.paymentService.paymentModel.create({
      amount: amount,
      paymentMethodNonce: paymentMethodNonce,
      deviceData: deviceData,
      braintreeTransactionId: brainTreeTransactionResponse.id,
      braintreeTransactionStatus: brainTreeTransactionResponse.status,
      braintreeTransactionResult: brainTreeTransactionResponse,
      user: user,
      plan: plan,
      notes: `Done payment for plan id ${plan} at amount ${amount}`,
    });
    const payment = await newPaymentInDb.save();
    //Create LicenseKey From Plan
    const licenseFromPlan = await this.licenseKeyService.createLicenseFromPlanAndAssignToUser(
      user,
      plan,
      payment._id
    );
    //Update plan with licensekey details
    payment.licenseKey = licenseFromPlan.key;
    await payment.save();
    return {
      payment: payment,
      brainTreeTransactionResponse: brainTreeTransactionResponse,
      licenseFromPlan: licenseFromPlan,
    };
  }

  async fetchMyPlans(user: string, queryDto: ParsedQueryDto) {
    queryDto.filter = {
      ...queryDto.filter,
      users: user,
      type: ApiKeyType.INDIVIDUAL,
      activePlan: { $exists: true },
    };
    return this.licenseKeyService.findAll(queryDto);
  }

  async upgradePlan(user: string, upgradePlanDto: UpgradePlanDto) {
    const {
      amount,
      paymentMethodNonce,
      transactionId,
      deviceData,
      oldPlanLicenseKey,
      upgradedPlan,
    } = upgradePlanDto;
    var brainTreeTransactionResponse: braintree.Transaction;
    if (!transactionId && paymentMethodNonce) {
      //Braintree transaction
      const createdSale = await this.paymentService.createTransactionSaleInBrainTree(
        paymentMethodNonce,
        amount,
        deviceData,
      )
      .catch(err=>{
        throw new BadRequestException(err)
      })
      if(!createdSale.success){
        throw new BadRequestException(`Transaction Failed : ${createdSale?.transaction?.status}`)
      }
      brainTreeTransactionResponse = createdSale.transaction;
    } else if (transactionId) {
      brainTreeTransactionResponse = await this.paymentService.getTransactionById(
        transactionId,
      );
    }
    if(!brainTreeTransactionResponse){
      throw new NotFoundException("Invalid transaction")
    }
    //Save  Payment info
    const newPaymentInDb = await this.paymentService.paymentModel.create({
      amount: amount,
      paymentMethodNonce: paymentMethodNonce,
      deviceData: deviceData,
      braintreeTransactionId: brainTreeTransactionResponse.id,
      braintreeTransactionStatus:
        brainTreeTransactionResponse.status,
      braintreeTransactionResult: brainTreeTransactionResponse,
      user: user,
      plan: upgradedPlan,
      notes: `Done upgrade payment for plan id ${upgradedPlan} at amount ${amount}`,
    });
    const payment = await newPaymentInDb.save();
    //Create LicenseKey From Plan
    const licenseFromPlan = await this.licenseKeyService.upgradeLicenseFromPlanAndAssignToUser(
      oldPlanLicenseKey,
      user,
      upgradedPlan,
      payment._id
    );
    //Update plan with licensekey details
    payment.licenseKey = licenseFromPlan.key;
    await payment.save();
    return {
      payment: payment,
      brainTreeTransactionResponse: brainTreeTransactionResponse,
      licenseFromPlan: licenseFromPlan,
    };
  }

  async renewPlan(user: string, renewPlanDto: RenewPlanDto,planLicenseKey:LicenseKey) {
    const {
      amount,
      paymentMethodNonce,
      transactionId,
      deviceData,
      oldPlanLicenseKey
    } = renewPlanDto;
    var brainTreeTransactionResponse: braintree.Transaction;
    if (!transactionId && paymentMethodNonce) {
      //Braintree transaction
      const createdSale = await this.paymentService.createTransactionSaleInBrainTree(
        paymentMethodNonce,
        amount,
        deviceData,
      )
      .catch(err=>{
        throw new BadRequestException(err)
      })
      if(!createdSale.success){
        throw new BadRequestException(`Transaction Failed : ${createdSale?.transaction?.status}`)
      }
      brainTreeTransactionResponse = createdSale.transaction;
    } else if (transactionId) {
      brainTreeTransactionResponse = await this.paymentService.getTransactionById(
        transactionId,
      );
    }
    if(!brainTreeTransactionResponse){
      throw new NotFoundException("Invalid transaction")
    }
    //Save  Payment info
    const newPaymentInDb = await this.paymentService.paymentModel.create({
      amount: amount,
      paymentMethodNonce: paymentMethodNonce,
      deviceData: deviceData,
      braintreeTransactionId: brainTreeTransactionResponse.id,
      braintreeTransactionStatus:
        brainTreeTransactionResponse.status,
      braintreeTransactionResult: brainTreeTransactionResponse,
      user: user,
      plan: planLicenseKey?.activePlan?._id,
      notes: `Done renewed for plan id ${planLicenseKey?.activePlan?._id} having licensekey ${planLicenseKey?._id} at amount ${amount}`,
    });
    const payment = await newPaymentInDb.save();
    //Create LicenseKey From Plan
    const licenseFromPlan = await this.licenseKeyService.renewLicenseFromPlanAndAssignToUser(
      oldPlanLicenseKey,
      user,
      planLicenseKey?.activePlan?._id,
      payment._id
    );
    //Update plan with licensekey details
    payment.licenseKey = licenseFromPlan.key;
    await payment.save();
    return {
      payment: payment,
      brainTreeTransactionResponse: brainTreeTransactionResponse,
      licenseFromPlan: licenseFromPlan,
    };
  }

  async buyExtraKeysForPlan(
    user: string,
    buyExtraKeysForExistingPlanDto: BuyExtraKeysForExistingPlanDto,
  ) {
    const {
      amount,
      paymentMethodNonce,
      transactionId,
      deviceData,
      oldPlanLicenseKey,
      extraKeys,
    } = buyExtraKeysForExistingPlanDto;
    var brainTreeTransactionResponse: braintree.Transaction;
    if (!transactionId && paymentMethodNonce) {
      //Braintree transaction
      const createdSale = await this.paymentService.createTransactionSaleInBrainTree(
        paymentMethodNonce,
        amount,
        deviceData,
      )
      .catch(err=>{
        throw new BadRequestException(err)
      })
      
      if(!createdSale.success){
        throw new BadRequestException(`Transaction Failed : ${createdSale?.transaction?.status}`)
      }
      brainTreeTransactionResponse = createdSale.transaction;
    } else if (transactionId) {
      brainTreeTransactionResponse = await this.paymentService.getTransactionById(
        transactionId,
      );
    }
    if(!brainTreeTransactionResponse){
      throw new NotFoundException("Invalid transaction")
    }
    const oldPlanLicenseKeyFromDb = await this.licenseKeyService.findOne({
      key: oldPlanLicenseKey,
    });
    //Save  Payment info
    const newPaymentInDb = await this.paymentService.paymentModel.create({
      amount: amount,
      paymentMethodNonce: paymentMethodNonce,
      deviceData: deviceData,
      braintreeTransactionId: brainTreeTransactionResponse.id,
      braintreeTransactionStatus:
        brainTreeTransactionResponse.status,
      braintreeTransactionResult: brainTreeTransactionResponse,
      user: user,
      plan: oldPlanLicenseKeyFromDb?.activePlan?._id,
      licenseKey: oldPlanLicenseKey,
      notes: `Brought ${extraKeys} extraKeys for existing plan and existing license key ${oldPlanLicenseKey}`,
    });
    const payment = await newPaymentInDb.save();

    //Update License
    const licenseFromPlan = await this.licenseKeyService.addExtraUsesToLicenseFromPlanAndAssignToUser(
      oldPlanLicenseKey,
      user,
      extraKeys,
      payment._id
    );
    return {
      payment: payment,
      brainTreeTransactionResponse: brainTreeTransactionResponse,
      licenseFromPlan: licenseFromPlan,
    };
  }
}
