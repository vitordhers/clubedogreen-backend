import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { CreatePasswordHashDto } from '../dto/create-user.dto';
import { UserService } from '../user.service';

@Injectable()
export class UpdatePasswordByEmailService {
  constructor(private userRep: UserService) {}
  async execute({
    recoverPasswordToken,
    password,
    confirmPassword,
  }: CreatePasswordHashDto) {
    const user = await this.userRep.findByToken(recoverPasswordToken)

    if (!user) {
      return {
        status: 400,
        data: { message: 'User not found' },
      };
    }

    if (password != confirmPassword) {
      return {
        status: 400,
        data: { message: 'Password mismatch' },
      };
    }
    const passwordHash = await bcrypt.hash(password, 10);

    const userUpdated = await this.userRep.updatePassword(
      user.id,
      passwordHash,
    );

    return {
      status: 200,
      data: userUpdated,
    };
  }
}
