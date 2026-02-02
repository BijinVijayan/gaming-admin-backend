import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { PublicRegisterDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  register(@Body() dto: PublicRegisterDto) {
    return this.usersService.register(dto);
  }
}
