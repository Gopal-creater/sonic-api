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
exports.MailController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const mail_service_1 = require("./mail.service");
const test_mail_dto_1 = require("./dto/test-mail.dto");
let MailController = class MailController {
    constructor(mailService) {
        this.mailService = mailService;
    }
    async sendTestMail(testMailDto) {
        const { toEmail, htmlBody } = testMailDto;
        await this.mailService
            .sendMail({
            to: toEmail,
            subject: "Test Email",
            html: htmlBody,
        })
            .catch((err) => {
            throw new common_1.UnprocessableEntityException(err === null || err === void 0 ? void 0 : err.message);
        });
        return {
            success: true,
            message: 'Sent',
        };
    }
};
__decorate([
    swagger_1.ApiOperation({ summary: 'Send test email' }),
    common_1.Post('/send-test-mail'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [test_mail_dto_1.TestMailDto]),
    __metadata("design:returntype", Promise)
], MailController.prototype, "sendTestMail", null);
MailController = __decorate([
    swagger_1.ApiTags('Mail Controller'),
    common_1.Controller('mail'),
    __metadata("design:paramtypes", [mail_service_1.MailService])
], MailController);
exports.MailController = MailController;
//# sourceMappingURL=mail.controller.js.map