import { Module } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { UserController } from './webhook.controller';
import { PassportModule } from '@nestjs/passport';
import { CaslModule } from 'src/casl/casl.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { UserService } from 'src/user/user.service';
import { FirebaseModule } from 'src/firebase/firebase.module';
@Module({
  imports: [
    CaslModule,
    FirebaseModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [UserController],
  providers: [WebhookService, JwtStrategy, UserService],
})
export class WebhookModule {}
