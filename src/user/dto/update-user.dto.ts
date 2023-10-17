import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsString,
  MinLength,
  Matches,
  IsUrl,
  IsBoolean,
} from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsString()
  @ApiProperty({
    description: 'Nome do usuário. Apenas para exibição',
    example: 'Paulo Salvatore',
  })
  name?: string;

  @IsString()
  @MinLength(6)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Senha muito fraca',
  })
  @ApiProperty({
    description: 'Senha do usuário para login',
    example: 'Abcd@1234',
  })
  password?: string;

  @IsUrl()
  @ApiProperty({
    description: 'Email do usuário',
    example: 'example@gmail.com',
  })
  Email?: string;

  @IsString()
  @ApiProperty({
    description: 'Cpf do usuário',
    example: '032.156.627-10',
  })
  cpf?: string;

  planType?: string;
  planTime?: string;
  nextPayment?: string;
  returnDate?: string;
  validation?: string;
}

interface Validate {
  ReturnDate: Date;
  LimitHour: Date;
}
