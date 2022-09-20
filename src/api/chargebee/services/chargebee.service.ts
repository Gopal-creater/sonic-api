import { Injectable } from '@nestjs/common';
import { ChargeBee } from 'chargebee-typescript';
import { ConfigService } from '@nestjs/config';
import * as moment from 'moment';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChargeBeeDocument } from '../schemas/chargebee.schema';
import { ChargebeePaymentDto } from '../dto/chargebeePayment.dto';
const chargebee = require('chargebee');

/**
 * https://sonicarba-test.chargebee.com/checkout_and_portal_settings/configuration
 * https://apidocs.chargebee.com/docs/api/hosted_pages#create_checkout_to_update_a_subscription
 * https://www.chargebee.com/docs/2.0/inapp-self-serve-portal.html
 *
 */
@Injectable()
export class ChargebeeService {
  chargebee1: ChargeBee;
  constructor(
    @InjectModel('ChargeBee') private chargeBeeModal: Model<ChargeBeeDocument>,
    private readonly configService: ConfigService,
  ) {
    this.chargebee1 = new ChargeBee();
    this.chargebee1.configure({
      site: this.configService.get('CHARGEBEE_SITE'),
      api_key: this.configService.get('CHARGEBEE_API_KEY'),
    });

    chargebee.configure({
      site: this.configService.get('CHARGEBEE_SITE'),
      api_key: this.configService.get('CHARGEBEE_API_KEY'),
    });
  }

  findPlans() {
    return chargebee.item
      .list({ 'type[is]': 'plan' })
      .request((error, result) => {
        console.log('result', result);
        if (error) {
          return Promise.reject(error);
        }
        return Promise.resolve(result);
      });
  }

  getPlanPrice(plan: string) {
    return chargebee.item_price
      .list({ 'item_id[is]': plan })
      .request((error, result) => {
        console.log('result', result);
        if (error) {
          return Promise.reject(error);
        }
        return Promise.resolve(result);
      });
  }

  getHostedPage_NewSubscription(customerId: string) {
    //TODO-Check if already the same subscription present or not
    return chargebee.hosted_page
      .checkout_new_for_items({
        customer: { id: customerId },
        redirect_url: 'https://sonicportal.arba-dev.uk/',
        subscription_items: [
          {
            item_price_id: 'Sonic-Basic-GBP-Yearly',
          },
        ],
        currency_code: 'GBP',
      })
      .request((error, result) => {
        console.log('result', result);
        if (error) {
          return Promise.reject(error);
        }
        return Promise.resolve(result);
      });
  }

  getHostedPageForAddon() {
    return chargebee.hosted_page
      .checkout_existing_for_items({
        subscription: {
          id: '198LqTT4wHTg08p7f',
        },
        subscription_items: [
          {
            item_price_id: 'Additional-SonicKey-GBP-Yearly',
            quantity: 10,
            // unit_price : 1000
          },
        ],
        currency_code: 'GBP',
      })
      .request((error, result) => {
        console.log('result', result);
        if (error) {
          return Promise.reject(error);
        }
        return Promise.resolve(result);
      });
  }

  getHostedPageForUpgrade() {
    return chargebee.hosted_page
      .checkout_existing_for_items({
        subscription: {
          id: 'AzyzejT4J1cuEDhc',
        },
        replace_items_list: true,
        subscription_items: [
          {
            item_price_id: 'sonickey_standard_plan-USD-Yearly',
            // quantity: 10,
            // unit_price : 1000
          },
        ],
        start_date: new Date(moment.utc().format()).getTime() / 1000,
        currency_code: 'GBP',
      })
      .request((error, result) => {
        console.log('result', result);
        if (error) {
          return Promise.reject(error);
        }
        return Promise.resolve(result);
      });
  }

  async createChargebeePayment(datas) {
    for (var i = 0; i < datas.list.length; i++) {
      var data = datas.list[i];
      var event: typeof chargebee.event = data.event;
      console.log('webhook event', event);

      //create chargebee Payload
      let payload: ChargebeePaymentDto = {
        customerId: event.content.customer.id,
        paymentId: event.id,
      };

      //Save in chargebee document
      let newPayment = await this.chargeBeeModal.create(payload);
      await newPayment.save();
    }
  }

  webhookCheckout(data) {
    console.log('webhookCheckout data', data);
    chargebee.event
      .list({
        event_type: { in: "['subscription_created']" },
      })
      .request((error, result) => {
        if (error) {
          console.log('webhook error', error);
          return Promise.reject(error);
        } else {
          this.createChargebeePayment(result);
          return Promise.resolve({
            message: 'chargebee webhook call successsful.',
          });
        }
      });
  }
}
