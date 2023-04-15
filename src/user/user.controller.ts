import { Controller, Get, Post, Body, Patch, Res, Query } from '@nestjs/common';
import { UserService } from './user.service';
import {
  CreateCheck,
  CreatePasswordHashDto,
  CreateUserDto,
  UserEmailDto,
} from './dto/create-user.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { RecoveryPasswordByEmail } from './services/update-my-password.service';
import { UpdatePasswordByEmailService } from './services/recovery-pasword-by-email.service';
import * as path from 'path';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private recoveryPasswordByEmail: RecoveryPasswordByEmail,
    private updatePasswordByEmailService: UpdatePasswordByEmailService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Criar um usuário',
  })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto, 'FREE', 'INFINITY', '');
  }

  @Get('/recovery-password')
  getIndexHtml(@Res() res, @Query('token') token: string) {
    if (process.env.PROD_URL !== '') {
      res.sendFile(path.join(__dirname, '../public/index.html'));
    } else {
      const filePath = path.join(
        process.cwd(),
        '..',
        'gamestock-back/public',
        'index.html',
      );
      res.sendFile(path.join(filePath));
    }
  }

  @Patch('/create-check')
  @ApiOperation({
    summary: 'Atualiza data de retorno do usuário | FREE',
  })
  createCheck(@Body() createCheck: CreateCheck) {
    let currentDate = new Date();
    currentDate.setTime(currentDate.getTime() + 24 * 60 * 60 * 1000);

    const now = new Date();
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000); // add 1 hour in milliseconds
    const result = {
      ReturnDate: currentDate,
      LimitHour: oneHourLater,
    };

    return this.userService.update(createCheck.UserId, {
      Validation: JSON.stringify(result),
    });
  }

  @Patch('/recovery-password')
  @ApiOperation({
    summary: 'Send email to recovery password.',
  })
  async recoveryPasswordSendEmail(
    @Body() { email }: UserEmailDto,
    @Res() res: Response,
  ) {
    const { status, data } = await this.recoveryPasswordByEmail.execute(email);
    return res.status(status).send(data);
  }

  @Patch('update-password')
  @ApiOperation({
    summary: 'User update password.',
  })
  updatePassword(@Body() updatePassword: CreatePasswordHashDto) {
    return this.updatePasswordByEmailService.execute(updatePassword);
  }
}
