import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AffiliateService {
  constructor(private prisma: PrismaService) {}

  // Track a Click
  async trackClick(affiliateId: string, ip: string, userAgent: string) {
    // Check if affiliate exists
    const affiliate = await this.prisma.partner.findUnique({
      where: { id: affiliateId },
    });

    if (!affiliate) throw new NotFoundException('Invalid Affiliate Link');

    // Record the click in DB
    await this.prisma.click.create({
      data: {
        partnerId: affiliateId,
        ipAddress: ip,
        userAgent: userAgent,
      },
    });

    return {
      message: 'Click tracked',
      redirectTo: 'https://mysite.com/register',
    };
  }

  async getStats(affiliateId: string) {
    const totalClicks = await this.prisma.click.count({
      where: { partnerId: affiliateId },
    });

    const totalSignups = await this.prisma.user.count({
      where: { partnerId: affiliateId },
    });

    const revenue = await this.prisma.commission.aggregate({
      where: { partnerId: affiliateId },
      _sum: { amount: true },
    });

    const conversionRate =
      totalClicks > 0
        ? ((totalSignups / totalClicks) * 100).toFixed(2) + '%'
        : '0%';

    return {
      totalClicks,
      totalSignups,
      conversionRate,
      totalRevenue: revenue._sum.amount || 0,
      referralLink: `http://localhost:3000/api/affiliate/track/${affiliateId}`,
    };
  }
}
