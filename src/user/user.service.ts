import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto, UpdateMyPasswordDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';
import { AuthService } from 'src/auth/auth.service';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
  ) {}

  async update(id: string, dto: UpdateUserDto) {
    await this.findById(id);

    const data: Prisma.UserUpdateInput = {
      ...dto,
    };

    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async create(
    dto: CreateUserDto,
    Plantype: string,
    Plantime: string,
    Nextpayment: string,
    ip: string,
  ) {
    const data: Prisma.UserCreateInput = {
      ...dto,
      Password: await bcrypt.hash(dto.Password, 10),
      Plantime: Plantime,
      Plantype: Plantype,
      ip: ip,
      Nextpayment: Nextpayment,
    };

    const myUser = await this.prisma.user
      .create({
        data,
        select: { Name: true, Email: true },
      })
      .catch(this.handleError);

    const loginDto = {
      Email: dto.Email,
      Password: dto.Password,
    };

    if (Plantype !== 'FREE') {
      return myUser;
    } else {
      if (myUser) {
        const result = await this.authService.login(loginDto);
        return result;
      }
    }
  }
  private userSelect = {
    id: true,
    Name: true,
    Email: true,
    Cpf: true,
    Plantime: true,
    Password: true,
    Plantype: true,
    createdAt: true,
    updatedAt: true,
  };

  findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        Name: true,
        Email: true,
        Password: true,
        Cpf: true,
      },
    });
  }

  async findUserByEmail(email: string) {
    const record = await this.prisma.user.findUnique({
      where: { Email: email },
      select: this.userSelect,
    });

    return record;
  }

  async findUserByIp(ip: string) {
    const record = await this.prisma.user.findUnique({
      where: { ip: ip },
      select: this.userSelect,
    });

    if (!record) {
      return false;
    }

    return true;
  }

  async findById(id: string) {
    const record = await this.prisma.user.findUnique({
      where: { id },
      select: this.userSelect,
    });

    if (!record) {
      throw new NotFoundException(`Registro com o ID '${id}' não encontrado.`);
    }

    return record;
  }

  async updateRecoveryPassword(id, recoverPasswordToken) {
    const record = await this.prisma.user.update({
      where: { id },
      data: { recoverPasswordToken },
    });

    return record;
  }

  async updatePassword(id: string, Password: string) {
    const updatedUser = await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        recoverPasswordToken: null,
        Password,
      },
    });

    delete updatedUser.Password;

    return updatedUser;
  }

  async updateMyPassword(updateMyPasswordDto: UpdateMyPasswordDto, id: string) {
    const data = { ...updateMyPasswordDto };
    return this.prisma.user.update({ where: { id }, data });
  }

  async findByToken(recoverPasswordToken: any) {
    return this.prisma.user.findFirst({ where: { recoverPasswordToken } });
  }

  async findOne(id: string) {
    return this.findById(id);
  }

  async delete(id: string) {
    await this.findById(id);

    await this.prisma.user.delete({ where: { id } });
  }

  handleError(error: Error): undefined {
    const errorLines = error.message?.split('\n');
    const lastErrorLine = errorLines[errorLines.length - 1]?.trim();

    if (!lastErrorLine) {
      console.error(error);
    }

    throw new UnprocessableEntityException(
      lastErrorLine || 'Algum erro ocorreu ao executar a operação',
    );
  }
}
