import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSessionsModule } from '../sessions/user-sessions/user-sessions.module';
import { MemberSessionsModule } from '../sessions/member-sessions/member-sessions.module';
import { MissionRecordsController } from './mission-records.controller';
import { MissionRecordsService } from './mission-records.service';
import { MissionRecord } from './entities/mission-record.entity';
import { MissionRecordsWebController } from './mission-records.web.controller';
import { MemberRewardsModule } from '../member-rewards/member-rewards.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MissionRecord]),
    UserSessionsModule,
    MemberSessionsModule,
    MemberRewardsModule,
  ],
  controllers: [MissionRecordsController, MissionRecordsWebController],
  providers: [MissionRecordsService],
  exports: [MissionRecordsService],
})
export class MissionRecordsModule {}
