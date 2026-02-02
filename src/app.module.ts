import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { AgentModule } from './agent/agent.module';
import { AffiliateModule } from './affiliate/affiliate.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [PrismaModule, AuthModule, AgentModule, AffiliateModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
