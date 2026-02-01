import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AgentService } from './agent.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { WithdrawDto } from './dto/withdraw.dto';

interface RequestWithUser extends Request {
  user: {
    id: string;
    email: string;
    role: string;
  };
}

@Controller('agent')
@UseGuards(AuthGuard('jwt'))
export class AgentController {
  constructor(private readonly agentService: AgentService) {}

  @Post('users')
  create(
    @Request() req: RequestWithUser,
    @Body() createUserDto: CreateUserDto,
  ) {
    return this.agentService.createUser(req.user.id, createUserDto);
  }

  @Get('users')
  findAll(@Request() req: RequestWithUser) {
    return this.agentService.findAllUsers(req.user.id);
  }

  @Get('dashboard')
  getDashboard(@Request() req: RequestWithUser) {
    return this.agentService.getDashboardStats(req.user.id);
  }

  @Post('withdraw')
  requestWithdrawal(
    @Request() req: RequestWithUser,
    @Body() body: WithdrawDto,
  ) {
    return this.agentService.requestWithdrawal(req.user.id, body.amount);
  }

  @Get('withdrawals')
  getWithdrawals(@Request() req: RequestWithUser) {
    return this.agentService.getWithdrawals(req.user.id);
  }
}
