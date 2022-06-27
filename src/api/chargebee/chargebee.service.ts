import { Injectable } from '@nestjs/common';
import { CreateChargebeeDto } from './dto/create-chargebee.dto';
import { UpdateChargebeeDto } from './dto/update-chargebee.dto';
import { ChargeBee } from 'chargebee-typescript';
import { ConfigService } from '@nestjs/config';
import * as moment from 'moment';
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
  constructor(private readonly configService: ConfigService) {
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

  getHostedPage() {
    return chargebee.hosted_page
      .checkout_new_for_items({
        shipping_address: {
          first_name: 'Arun',
          last_name: 'TA',
          // city: 'Bangalore',
          // state: 'Karnataka',
          // zip: '560038',
          // country: 'In',
        },
        customer: {
          id: '5728f50d-146b-47d2-aa7b-a50bc37d641d',
        },
        subscription_items: [
          {
            item_price_id: 'Basic-Plan-GBP-Yearly',
          },
        ],
        currency_code:"GBP"
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
        currency_code:"GBP"
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
        replace_items_list:true,
        subscription_items: [
          {
            item_price_id: 'sonickey_standard_plan-USD-Yearly',
            // quantity: 10,
            // unit_price : 1000
          },
        ],
        start_date:(new Date(moment.utc().format()).getTime())/1000,
        currency_code:"GBP"
      })
      .request((error, result) => {
        console.log('result', result);
        if (error) {
          return Promise.reject(error);
        }
        return Promise.resolve(result);
      });
  }
}