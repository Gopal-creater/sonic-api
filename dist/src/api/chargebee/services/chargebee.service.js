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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChargebeeService = void 0;
const common_1 = require("@nestjs/common");
const chargebee_typescript_1 = require("chargebee-typescript");
const config_1 = require("@nestjs/config");
const moment = require("moment");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const chargebee = require('chargebee');
let ChargebeeService = class ChargebeeService {
    constructor(chargeBeeModal, configService) {
        this.chargeBeeModal = chargeBeeModal;
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
    getHostedPage_NewSubscription(customerId, planPriceId) {
        return chargebee.hosted_page
            .checkout_new_for_items({
            customer: { id: customerId },
            redirect_url: 'https://sonicportal.arba-dev.uk/',
            subscription_items: [
                {
                    item_price_id: planPriceId,
                },
            ],
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
            }
            else {
                this.createChargebeePayment(result);
                return Promise.resolve({
                    message: 'chargebee webhook call successsful.',
                });
            }
        });
    }
    async createChargebeePayment(datas) {
        for (var i = 0; i < datas.list.length; i++) {
            var data = datas.list[i];
            var event = data.event;
            console.log('webhook event', event);
            let oldEvent = await this.chargeBeeModal.find({ paymentId: event.id });
            if (!oldEvent) {
                let payload = {
                    customerId: event.content.customer.id,
                    paymentId: event.id,
                };
                let newPayment = await this.chargeBeeModal.create(payload);
                await newPayment.save();
            }
        }
    }
};
ChargebeeService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('Chargebee')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        config_1.ConfigService])
], ChargebeeService);
exports.ChargebeeService = ChargebeeService;
//# sourceMappingURL=chargebee.service.js.map