import { Module } from '@nestjs/common';
import { RewardsService } from './rewards.service';
import { RewardsController } from './rewards.controller';
import { RedemptionRecordsModule } from '../redemption-records/redemption-records.module';
import { RedemptionCodesModule } from '../redemption-codes/redemption-codes.module';
import { ProductsModule } from '../products/products.module';
import { MemberSessionsModule } from '../sessions/member-sessions/member-sessions.module';
import { MemberRewardsModule } from '../member-rewards/member-rewards.module';
import { MissionRecordsModule } from '../mission-records/mission-records.module';
import { MissionsModule } from '../missions/missions.module';

@Module({
  imports: [
    RedemptionRecordsModule,
    RedemptionCodesModule,
    ProductsModule,
    MemberSessionsModule,
    MemberRewardsModule,
    MissionRecordsModule,
    MissionsModule,
  ],
  controllers: [RewardsController],
  providers: [RewardsService],
})
export class RewardsModule {}
