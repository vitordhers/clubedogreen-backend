import { Module } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { UserController } from './webhook.controller';
import { PrismaModule } from 'src/prisma/prisma.module'; // < NOVO IMPORT
import { PassportModule } from '@nestjs/passport';
import { CaslModule } from 'src/casl/casl.module';
import { AuthService } from 'src/auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { UserService } from 'src/user/user.service';
@Module({
  imports: [
    PrismaModule,
    CaslModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '24h' },
    })
  ],
  controllers: [UserController],
  providers: [WebhookService,AuthService,JwtStrategy,UserService],
})
export class WebhookModule {}
