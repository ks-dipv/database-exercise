import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignInDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    description: 'email of the user',
    example: 'tom@gmail.com',
    required: true,
  })
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Password of the user',
    example: 'tom@12345*',
    required: true,
  })
  password: string;
}
