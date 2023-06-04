import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';
import { AuthService } from 'src/auth/auth.service';
import { WebhookDto } from './dto/create-user.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class WebhookService {
  constructor(
    private readonly userService: UserService,
    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
  ) {}

  private userSelect = {
    id: true,
    Name: true,
    Email: true,
    Cpf: true,
    Plantime: true,
    Plantype: true,
    createdAt: true,
    updatedAt: true,
  };

  private formatDate(value) {
    // Format the result as "YYYY/MM/DD"
    var year = value.getFullYear();
    var month = ('0' + (value.getMonth() + 1)).slice(-2);
    var day = ('0' + value.getDate()).slice(-2);

    return year + '-' + month + '-' + day;
  }

  async webhookValidation(email: string, data: WebhookDto) {
    const record = await this.prisma.user.findUnique({
      where: { Email: email },
      select: this.userSelect,
    });
    const createUserDto = {
      Name: data.client_name,
      Password: data.client_documment,
      Email: data.client_email,
      Cpf: data.client_documment,
      ReturnDate: null,
    };

    var next_charge = new Date();
    var next_charge_result;
    switch (data.plan_key) {
      case 'PPLQQBLHC': //R$ 37,90 - MENSAL
        // Add one month to the current date
        next_charge.setMonth(next_charge.getMonth() + 1);
        next_charge_result = this.formatDate(next_charge);
        break;
      case 'PPLQQBLHH': //R$ 197,00 - SEMESTRAL
        // Add one month to the current date
        next_charge.setMonth(next_charge.getMonth() + 6);
        next_charge_result = this.formatDate(next_charge);
        break;
      case 'PPLQQBLHI': //R$ 317,90 - ANUAL
        // Add one month to the current date
        next_charge.setMonth(next_charge.getMonth() + 12);
        next_charge_result = this.formatDate(next_charge);
        break;
      default:
        next_charge_result = this.formatDate(next_charge);
        break;
    }

    if (!record) {
      const newUser = this.userService.create(
        createUserDto,
        data.plan_name,
        data.product_name,
        next_charge_result,
      );
      return newUser;
    } else {
      const newData = {
        Plantype: data.plan_name,
        Plantime: data.product_name,
        Nextpayment: next_charge_result,
        Validation: null
      };
      console.log(newData)
      const newUser = this.userService.update(record.id, newData);
      return newUser;
    }
  }
}
