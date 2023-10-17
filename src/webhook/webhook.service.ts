import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { WebhookDto } from './dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { FirebaseService } from 'src/firebase/firebase.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@Injectable()
export class WebhookService {
  constructor(private readonly userService: UserService) {}

  private formatDate(value) {
    // Format the result as "YYYY/MM/DD"
    var year = value.getFullYear();
    var month = ('0' + (value.getMonth() + 1)).slice(-2);
    var day = ('0' + value.getDate()).slice(-2);

    return year + '-' + month + '-' + day;
  }

  async webhookValidation(email: string, data: WebhookDto) {
    const record = await this.userService.findUserByEmail(email);
    const createUserDto: CreateUserDto = {
      name: data.client_name,
      password: data.client_documment,
      email: data.client_email,
      cpf: data.client_documment,
      returnDate: null,
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
    createUserDto.returnDate = next_charge_result;
    if (!record) {
      const newUser = this.userService.create(
        createUserDto,
        data.plan_name,
        data.product_name,
        next_charge_result,
        '',
      );
      return newUser;
    } else {
      const newData = {
        planType: data.plan_name,
        planTime: data.product_name,
        nextPayment: next_charge_result,
        validation: null,
      };
      console.log(newData);
      const newUser = this.userService.update(record.id, newData);
      return newUser;
    }
  }

  async webhookAutoFree(email: string, data: WebhookDto) {
    const record = await this.userService.findUserByEmail(email);

    const newData = {
      planType: 'FREE',
      planTime: 'INFINITY',
      validation: null,
      nextPayment: '',
    };
    console.log(newData);
    const newUser = this.userService.update(record.id, newData);
    return newUser;
  }
}
