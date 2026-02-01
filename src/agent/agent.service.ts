import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AgentService {
  constructor(private prisma: PrismaService) {}

  // Create new user
  async createUser(agentId: string, createUserDto: CreateUserDto) {
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: createUserDto.email },
          { username: createUserDto.username },
        ],
      },
    });

    if (existingUser) {
      throw new BadRequestException(
        'User with this email or username already exists',
      );
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    return this.prisma.user.create({
      data: {
        username: createUserDto.username,
        email: createUserDto.email,
        password: hashedPassword,
        partnerId: agentId,
      },
      select: {
        id: true,
        username: true,
        email: true,
        partnerId: true,
        createdAt: true,
      },
    });
  }

  // Find all users
  async findAllUsers(agentId: string) {
    return this.prisma.user.findMany({
      where: { partnerId: agentId },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Dashboard Stats
  async getDashboardStats(agentId: string) {
    // Count total users of agent
    const totalUsers = await this.prisma.user.count({
      where: { partnerId: agentId },
    });

    // Agent's Wallet Balance
    const agent = await this.prisma.partner.findUnique({
      where: { id: agentId },
      select: { walletBalance: true },
    });

    // Total Commission Earned
    const totalCommission = await this.prisma.commission.aggregate({
      where: { partnerId: agentId },
      _sum: {
        amount: true,
      },
    });

    const recentActivity = await this.prisma.commission.findMany({
      where: { partnerId: agentId },
      take: 5,
      orderBy: { createdAt: 'desc' },
    });

    return {
      totalUsers,
      walletBalance: agent?.walletBalance || 0,
      totalCommission: totalCommission._sum.amount || 0,
      recentActivity,
    };
  }

  // 5. Request a Payout
  async requestWithdrawal(agentId: string, amount: number) {
    const agent = await this.prisma.partner.findUnique({
      where: { id: agentId },
    });

    if (agent && agent.walletBalance < amount) {
      throw new BadRequestException('Insufficient funds in wallet');
    }
    // Run the transaction
    const [updatedPartner, payout] = await this.prisma.$transaction([
      this.prisma.partner.update({
        where: { id: agentId },
        data: { walletBalance: { decrement: amount } },
        select: { walletBalance: true },
      }),
      this.prisma.payout.create({
        data: {
          amount: amount,
          status: 'PENDING',
          partnerId: agentId,
        },
        select: {
          id: true,
          amount: true,
          status: true,
          createdAt: true,
        },
      }),
    ]);

    return {
      message: 'Withdrawal requested successfully',
      newBalance: updatedPartner.walletBalance,
      payoutDetails: payout,
    };
  }

  async getWithdrawals(agentId: string) {
    return this.prisma.payout.findMany({
      where: { partnerId: agentId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
