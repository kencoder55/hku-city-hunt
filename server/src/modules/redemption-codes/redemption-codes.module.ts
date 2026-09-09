import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedemptionCodesService } from './redemption-codes.service';
import { RedemptionCodesController } from './redemption-codes.controller';
import { RedemptionCodesWebController } from './redemption-codes.web.controller';
import { RedemptionCode } from './entities/redemption-code.entity';
import { UserSessionsModule } from 'src/modules/sessions/user-sessions/user-sessions.module';
import { MemberSessionsModule } from 'src/modules/sessions/member-sessions/member-sessions.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RedemptionCode]),
    UserSessionsModule,
    MemberSessionsModule,
  ],
  controllers: [RedemptionCodesController, RedemptionCodesWebController],
  providers: [RedemptionCodesService],
  exports: [RedemptionCodesService],
})
export class RedemptionCodesModule {}
