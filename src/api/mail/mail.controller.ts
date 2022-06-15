import {
  Body,
  Controller,
  Post,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { MailService } from './mail.service';
import { TestMailDto } from './dto/test-mail.dto';

@ApiTags('Mail Controller')
@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @ApiOperation({ summary: 'Send test email' })
  @Post('/send-test-mail')
  async sendTestMail(@Body() testMailDto: TestMailDto) {
    const { toEmail, htmlBody } = testMailDto;
    await this.mailService
      .sendMail({
        to: toEmail,
        subject:"Test Email",
        html: htmlBody,
      })
      .catch((err) => {
        throw new UnprocessableEntityException(err?.message);
      });
    return {
      success: true,
      message: 'Sent',
    };
  }
}
