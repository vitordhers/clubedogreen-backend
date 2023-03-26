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
      ReturnDate: null
    }
    if (!record) {
      const newUser = this.userService.create(createUserDto,data.plan_name,data.product_name,data.subs_next_charge)
      return newUser
    }else{
      const newData = {
        Plantype: data.plan_name,
        Plantime: data.product_name,
        Nextpayment: data.subs_next_charge
      }
      const newUser = this.userService.update(record.id,newData)
      return newUser;
    }
  }
}
