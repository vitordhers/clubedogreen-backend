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
import {
  WebhookApple,
  WebhookDto,
  WebhookGooglePlay,
} from './dto/create-user.dto';
import { ResponseWebhook } from './entities/webhook.entity';
import { UserService } from 'src/user/user.service';

@ApiTags('webhook')
@Controller('webhook')
export class UserController {
  constructor(
    private readonly webhookService: WebhookService,
    private caslAbilityFactory: CaslAbilityFactory,
    private readonly userService: UserService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Webhook | payment',
  })
  create(@Body() Webhook: WebhookDto) {
    const userExist = this.webhookService.webhookValidation(
      Webhook.client_email,
      Webhook,
    );
    return userExist;
    // return this.userService.create(createUserDto);
  }

  @Post('/reviews-googleplay')
  @ApiOperation({
    summary: 'Webhook | google play reviews trigger',
  })
  async createReviewsGoogle(@Body() Webhook: WebhookGooglePlay) {
    let currentDate = new Date();
    currentDate.setTime(currentDate.getTime() + 24 * 60 * 60 * 1000);

    const now = new Date();
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000); // add 1 hour in milliseconds
    const result = {
      ReturnDate: currentDate,
      LimitHour: oneHourLater,
    };
    const thisUser = await this.userService.findUserByEmail(Webhook.message.feedback.userEmail)
    if(thisUser){
      return this.userService.update(thisUser.id, {
        Validation: JSON.stringify(result),
      });
    }else{
      return {message: "This user doens't exist"}
    }
  }

  @Post('/reviews-applestore')
  @ApiOperation({
    summary: 'Webhook | apple store reviews trigger',
  })
  createReviewsApple(@Body() Webhook: WebhookApple) {
    return Webhook;
    // return this.userService.create(createUserDto);
  }
}
