import {
  BadRequestException,
  Injectable,
  NotFoundException,
  OnModuleInit,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateUserDto, UpdateMyPasswordDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { FirebaseService } from 'src/firebase/firebase.service';
import { LoginDto } from 'src/auth/dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginResponseDto } from 'src/auth/dto/login-response.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UserService implements OnModuleInit {
  users: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>;

  constructor(
    private readonly firebase: FirebaseService,
    private readonly jwtService: JwtService,
  ) {}

  onModuleInit() {
    this.users = this.firebase.firestore.collection('users');
  }

  async update(id: string, dto: UpdateUserDto) {
    try {
      const uid = await this.findUId(id);

      const data = {
        ...dto,
      };

      const result = await this.users.doc(uid).update(data);
      console.log('@@@@ RESULT', { result });
      const user = await this.findOne(uid);
      return user;
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error);
    }
  }

  async create(
    dto: CreateUserDto,
    planType: string,
    planTime: string,
    nextPayment: string,
    ip: string,
  ) {
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(dto.password, salt);
    const data: User = {
      ...dto,
      id: uuidv4(),
      password,
      planTime,
      planType,
      ip,
      isAdmin: false,
      nextPayment,
    };

    const docRef = await this.users.add(data);

    const loginDto: LoginDto = {
      email: dto.email,
      password: dto.password,
    };

    const newUser = await docRef.get();

    if (planType !== 'FREE') {
      return newUser;
    }
    if (newUser) {
      const result = await this.login(loginDto);
      return result;
    }
  }

  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    const { email, password } = loginDto;

    // Procura e checa se o user existe, usando o nickname
    const user = await this.findUserByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Usuário e/ou senha inválidos');
    }

    // Valida se a senha informada é corretaa
    const isHashValid = await bcrypt.compare(password, user.password);

    if (!isHashValid) {
      throw new UnauthorizedException('Usuário e/ou senha inválidos');
    }

    delete user.password;

    return {
      token: this.jwtService.sign(
        { email },
        { secret: process.env.JWT_SECRET },
      ),
      user,
    };
  }

  async findAll() {
    const snapshot = await this.users.get();

    const users = [];
    snapshot.forEach((snap) => {
      const userData = snap.data();
      users.push(userData);
    });

    return users;
  }

  async findUserByEmail(email: string) {
    const snapshot = await this.users.where('email', '==', email).get();

    const users = [];
    snapshot.forEach((snap) => {
      const userData = snap.data();
      users.push(userData);
    });

    return users[0];
  }

  async findUserByIp(ip: string) {
    const snapshot = await this.users.where('ip', '==', ip).get();

    const users = [];
    snapshot.forEach((snap) => {
      const userData = snap.data();
      users.push(userData);
    });

    return !!users.length;
  }

  async findUId(id: string) {
    const snapshot = await this.users.where('id', '==', id).get();

    const uids = [];
    snapshot.forEach((snap) => {
      snap.id;
      uids.push(snap.id);
    });

    return uids[0];
  }

  async updateRecoveryPassword(id, recoverPasswordToken) {
    const uid = await this.findUId(id);

    this.users.doc(uid).update({ recoverPasswordToken });
  }

  async updatePassword(id: string, password: string) {
    const uid = await this.findUId(id);
    await this.users.doc(uid).update({
      recoverPasswordToken: null,
      password,
    });
    const updatedUser = this.findOne(id);
    return updatedUser;
  }

  async updateMyPassword(updateMyPasswordDto: UpdateMyPasswordDto, id: string) {
    const data = { ...updateMyPasswordDto };
    const uid = await this.findUId(id);
    const result = await this.users.doc(uid).update(data);
    return !!result.writeTime;
  }

  async findByToken(recoverPasswordToken: any) {
    const snapshot = await this.users
      .where('recoverPasswordToken', '==', recoverPasswordToken)
      .get();

    const users = [];
    snapshot.forEach((snap) => {
      const userData = snap.data();
      users.push(userData);
    });

    return users[0];
  }

  async findOne(uid: string) {
    return (await this.users.doc(uid).get()).data();
  }

  async delete(id: string) {
    try {
      const uid = await this.findUId(id);

      await this.users.doc(uid).delete();
      return true;
    } catch (error) {
      return false;
    }
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
