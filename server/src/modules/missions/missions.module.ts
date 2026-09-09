import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemberSessionsModule } from '../sessions/member-sessions/member-sessions.module';
import { UserSessionsModule } from '../sessions/user-sessions/user-sessions.module';
import { Mission } from './entities/mission.entity';
import { MissionsController } from './missions.controller';
import { MissionsService } from './missions.service';
import { MissionsWebController } from './missions.web.controller';
import { MissionRecordsModule } from '../mission-records/mission-records.module';
import { MemberRewardsModule } from '../member-rewards/member-rewards.module';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([Mission]),
    UserSessionsModule,
    MemberSessionsModule,
    MemberSessionsModule,
    MissionRecordsModule,
    MemberRewardsModule,
  ],
  controllers: [MissionsController, MissionsWebController],
  providers: [MissionsService],
  exports: [MissionsService],
})
export class MissionsModule {}
