import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNumber,
  IsString,
  IsUrl,
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
