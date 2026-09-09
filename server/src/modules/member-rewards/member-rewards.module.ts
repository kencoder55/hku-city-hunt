import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemberReward } from './entities/member-reward.entity';
import { MemberRewardsController } from './member-rewards.controller';
import { MemberRewardsWebController } from './member-rewards.web.controller';
import { MemberRewardsService } from './member-rewards.service';
import { UserSessionsModule } from '../sessions/user-sessions/user-sessions.module';
import { MemberSessionsModule } from '../sessions/member-sessions/member-sessions.module';

@Module({
  imports: [TypeOrmModule.forFeature([MemberReward]), UserSessionsModule, MemberSessionsModule],
  controllers: [MemberRewardsController, MemberRewardsWebController],
  providers: [MemberRewardsService],
  exports: [MemberRewardsService],
})
export class MemberRewardsModule {}
