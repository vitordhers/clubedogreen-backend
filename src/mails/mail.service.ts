import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';

type DataResponse = {
  local: string;
  message: string;
};

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(user: User) {
    const { email, name, recoverPasswordToken } = user;
    const url = `${process.env.PROD_URL}/user/recovery-password?token=${recoverPasswordToken}`;

    await this.mailerService.sendMail({
      to: email,
      from: 'clubedogreensuporte@gmail.com', // override default from
      subject: 'Recupere sua senha 😅',
      template: 'send', // `.hbs` extension is appended automatically
      context: {
        // ✏️ filling curly brackets with content
        name,
        url,
      },
    });
  }
}
