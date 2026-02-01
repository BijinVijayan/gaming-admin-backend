import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class LoginDto {
  @IsEmail()
  email: string;

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
