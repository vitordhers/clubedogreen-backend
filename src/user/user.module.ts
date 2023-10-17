import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PassportModule } from '@nestjs/passport';
import { CaslModule } from 'src/casl/casl.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { MailModule } from 'src/mails/mail.module';
import { RecoveryPasswordByEmail } from './services/update-my-password.service';
import { UpdatePasswordByEmailService } from './services/recovery-pasword-by-email.service';
import { FirebaseModule } from 'src/firebase/firebase.module';
@Module({
  imports: [
    FirebaseModule,
    CaslModule,
    MailModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    JwtStrategy,
    RecoveryPasswordByEmail,
    UpdatePasswordByEmailService,
  ],
  exports: [UserService],
})
export class UserModule {}
