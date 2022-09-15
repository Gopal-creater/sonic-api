"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChargebeeService = void 0;
const common_1 = require("@nestjs/common");
const chargebee_typescript_1 = require("chargebee-typescript");
const config_1 = require("@nestjs/config");
const moment = require("moment");
const chargebee = require('chargebee');
let ChargebeeService = class ChargebeeService {
    constructor(configService) {
        this.configService = configService;
        this.chargebee1 = new chargebee_typescript_1.ChargeBee();
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
    getPlanPrice(plan) {
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
    getHostedPage_NewSubscription(data) {
        return chargebee.hosted_page
            .checkout_new_for_items({
            customer: { id: data.customerId, email: data.customerEmail },
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
};
ChargebeeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], ChargebeeService);
exports.ChargebeeService = ChargebeeService;
//# sourceMappingURL=chargebee.service.js.map