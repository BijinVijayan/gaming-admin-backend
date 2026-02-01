import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from './dto/create-auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const existingUser = await this.prisma.partner.findUnique({
      where: { email: registerDto.email },
    });
    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const partner = await this.prisma.partner.create({
      data: {
        email: registerDto.email,
        name: registerDto.name,
        password: hashedPassword,
        role: registerDto.role,
      },
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = partner;
    return result;
  }

  async login(loginDto: LoginDto) {
    const user = await this.prisma.partner.findUnique({
      where: { email: loginDto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 2. Compare passwords
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate the JWT Token
    const payload = { sub: user.id, email: user.email, role: user.role };

    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }
}
