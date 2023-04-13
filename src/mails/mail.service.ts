import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
const Handlebars = require('handlebars');
const fs = require('fs');


type DataResponse = {
  local: string;
  message: string;
};


@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(user: User) {
    const { Email, Name, recoverPasswordToken } = user;
    const url = `${process.env.PROD_URL}/user/recovery-password?token=${recoverPasswordToken}`;
    // const template = fs.readFileSync('./src/mails/templates/send.hbs', 'utf8');


    await this.mailerService.sendMail({
      to: Email,
      from: "clubedogreensuporte@gmail.com", // override default from
      subject: 'Recupere sua senha 😅',
      template: 'send', // `.hbs` extension is appended automatically
      context: {
        // ✏️ filling curly brackets with content
        name: Name,
        url,
      },
    });
  }
}
