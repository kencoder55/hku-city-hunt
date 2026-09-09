import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedemptionRecordsService } from './redemption-records.service';
import { RedemptionRecordsController } from './redemption-records.controller';
import { RedemptionRecordsWebController } from './redemption-records.web.controller';
import { RedemptionRecord } from './entities/redemption-record.entity';
import { UserSessionsModule } from '../sessions/user-sessions/user-sessions.module';
import { MemberSessionsModule } from '../sessions/member-sessions/member-sessions.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RedemptionRecord]),
    UserSessionsModule,
    MemberSessionsModule,
  ],
  controllers: [RedemptionRecordsController, RedemptionRecordsWebController],
  providers: [RedemptionRecordsService],
  exports: [RedemptionRecordsService],
})
export class RedemptionRecordsModule {}
