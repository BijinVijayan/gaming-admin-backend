import { IsEmail, IsStrongPassword } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'agent@test.com', description: 'The partner email' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Password@123', description: 'Secure password' })
  @IsStrongPassword(
    {
      minLength: 6,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    {
      message:
        'Password too weak. It must contain minimum 6 characters with 1 lowercase, 1 uppercase, 1 number, and 1 special character',
    },
  )
  password: string;
}
