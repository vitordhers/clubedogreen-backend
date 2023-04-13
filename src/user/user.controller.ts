import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Res,
  Query,
} from '@nestjs/common';
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
    const filePath = path.join(process.cwd(), '..', 'gamestock-back/public', 'index.html');
    res.sendFile(filePath);
  }

  @Patch('/create-check')
  @ApiOperation({
    summary: 'Atualiza data de retorno do usuário | FREE',
  })
  createCheck(@Body() createCheck: CreateCheck) {
    return this.userService.update(createCheck.UserId, {
      ReturnDate: createCheck.ReturnDate,
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
    console.log(updatePassword)
    return this.updatePasswordByEmailService.execute(updatePassword);
  }
}
