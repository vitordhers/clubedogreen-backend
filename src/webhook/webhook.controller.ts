import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CaslAbilityFactory } from 'src/casl/casl-ability.factory';
import { Action } from 'src/casl/enum';
import { LoggedUser } from 'src/auth/logged-user-decorator';
import { User } from '@prisma/client';
import { WebhookDto } from './dto/create-user.dto';
import { ResponseWebhook } from './entities/webhook.entity';

@ApiTags('webhook')
@Controller('webhook')
export class UserController {
  constructor(
    private readonly webhookService: WebhookService,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Webhook | payment',
  })
  create(@Body() Webhook: WebhookDto) {
    const userExist = this.webhookService.webhookValidation(
      Webhook.client_email,
      Webhook
    );
    return userExist
    // return this.userService.create(createUserDto);
  }
}
