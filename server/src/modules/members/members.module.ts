import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSessionsModule } from '../sessions/user-sessions/user-sessions.module';
import { Member } from './entities/member.entity';
import { MembersController } from './members.controller';
import { MembersService } from './members.service';
import { MemberSessionsModule } from '../sessions/member-sessions/member-sessions.module';
import { MembersWebController } from './members.web.controller';
import { VerificationCodesModule } from 'src/modules/verification-codes/verification-codes.module';
import { HttpModule } from '@nestjs/axios';
import { MembersResetPasswordTokensModule } from '../members-reset-password-tokens/members-reset-password-tokens.module';
import { SmsModule } from '../sms/sms.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Member]),
    UserSessionsModule,
    MemberSessionsModule,
    VerificationCodesModule,
    HttpModule,
    MembersResetPasswordTokensModule,
    SmsModule,
  ],
  controllers: [MembersController, MembersWebController],
  providers: [MembersService],
  exports: [MembersService],
})
export class MembersModule {}
