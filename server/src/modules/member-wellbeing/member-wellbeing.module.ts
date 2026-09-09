import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSessionsModule } from '../sessions/user-sessions/user-sessions.module';
import { MemberSessionsModule } from '../sessions/member-sessions/member-sessions.module';
import { MemberWellbeingController } from './member-wellbeing.controller';
import { MemberWellbeingWebController } from './member-wellbeing.web.controller';
import { MemberWellbeingService } from './member-wellbeing.service';
import { MemberWellbeing } from './entities/member-wellbeing.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([MemberWellbeing]),
    UserSessionsModule,
    MemberSessionsModule,
  ],
  controllers: [MemberWellbeingController, MemberWellbeingWebController],
  providers: [MemberWellbeingService],
  exports: [MemberWellbeingService],
})
export class MemberWellbeingModule {}
