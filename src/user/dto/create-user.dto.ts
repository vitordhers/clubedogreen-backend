import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUrl,
  Length,
  Matches,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @ApiProperty({
    description: 'Nome do usuário. Apenas para exibição',
    example: 'Paulo Salvatore',
  })
  Name: string;

  @IsString()
  @MinLength(6)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Senha muito fraca',
  })
  @ApiProperty({
    description: 'Senha do usuário para login',
    example: 'Abcd@1234',
  })
  Password: string;

  @IsUrl()
  @ApiProperty({
    description: 'Email do usuário',
    example: 'example@gmail.com',
  })
  Email: string;

  @IsString()
  @ApiProperty({
    description: 'Cpf do usuário',
    example: '032.156.627-10',
  })
  Cpf: string;
  ReturnDate: string;
}

export class CreateCheck {
  @IsString()
  @ApiProperty({
    description: 'Data de retorno de uso do plano free',
    example: '2023-03-26T18:18:33.385Z',
  })
  ReturnDate: string;
  @ApiProperty({
    description: 'User id',
    example: '2023-03-26T18:18:33.385Z',
  })
  UserId: string;
}

export class UserEmailDto {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    description: "User's email address",
    example: 'owner@carlos.com',
  })
  email: string;
}

export class UpdateMyPasswordDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: "User's password",
    example: '0Wn3r12#$',
  })
  oldPassword: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'You need a stronger password.',
  })
  @ApiProperty({
    description:
      "User's password should contain at least capital letters, small letters, a number and or a special character.",
    example: '0Wn3r12#$2.0',
  })
  password: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Confirm password',
    example: '0Wn3r12#$2.0',
  })
  confirmNewPassword: string;
}

export class CreatePasswordHashDto {
  @IsString()
  @Length(8, 50)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password too weak',
  })
  @ApiProperty({
    description: 'The password of the user.',
    example: '12345#Senha',
  })
  password: string;

  @IsString()
  @ApiProperty({
    description: 'User password confirmation',
    example: '12345#Senha',
  })
  confirmPassword: string;

  @IsString()
  @ApiProperty({
    description: 'The users recovery token.',
    example: '44b7044c452a76be1ec1c63d4a0653e1cd231108d6fb418b264e1435ca80763d',
  })
  recoverPasswordToken?: string;
}
