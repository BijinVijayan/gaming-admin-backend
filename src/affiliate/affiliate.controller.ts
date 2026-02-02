import {
  Controller,
  Get,
  Param,
  Req,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AffiliateService } from './affiliate.service';
import { AuthGuard } from '@nestjs/passport';

interface RequestWithUser extends Request {
  user: { id: string; role: string };
}

@Controller('affiliate')
export class AffiliateController {
  constructor(private readonly affiliateService: AffiliateService) {}

  @Get('track/:id')
  async trackClick(@Param('id') id: string, @Req() req) {
    // We capture their IP and Browser Info for analytics
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const ip = req.ip || '0.0.0.0';
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
    const userAgent = req.headers['user-agent'] || 'Unknown';

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return this.affiliateService.trackClick(id, ip, userAgent);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('dashboard')
  getDashboard(@Request() req: RequestWithUser) {
    return this.affiliateService.getStats(req.user.id);
  }
}
