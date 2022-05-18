import { MailerService, ISendMailOptions } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { UserDB } from '../user/schemas/user.db.schema';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendInvitationEmail(user: UserDB) {
    return this.mailerService.sendMail({
      to: user.email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: 'Welcome to App',
      template: './invitation', // `.hbs` extension is appended automatically
      context: {
        // ✏️ filling curly brackets with content
        name: user.name,
      },
    });
  }

  async sendMail(sendMainOption: ISendMailOptions) {
    return this.mailerService.sendMail(sendMainOption);
  }
}
