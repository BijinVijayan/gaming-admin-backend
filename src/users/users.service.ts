import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PublicRegisterDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async register(dto: PublicRegisterDto) {
    const existing = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: dto.email }, { username: dto.username }],
      },
    });

    if (existing) throw new BadRequestException('User already exists');

    let partnerId = '';
    if (dto.referralCode) {
      const partner = await this.prisma.partner.findUnique({
        where: { id: dto.referralCode },
      });
      if (partner) {
        partnerId = partner.id;
      }
    }

    // 3. Create User
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    return this.prisma.user.create({
      data: {
        username: dto.username,
        email: dto.email,
        password: hashedPassword,
        partnerId: partnerId,
      },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
        partnerId: true,
      },
    });
  }
}
