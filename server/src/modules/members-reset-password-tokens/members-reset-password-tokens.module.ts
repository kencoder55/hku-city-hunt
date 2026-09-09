import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MembersResetPasswordToken } from './entities/members-reset-password-token.entity';
import { MembersResetPasswordTokensController } from './members-reset-password-tokens.controller';
import { MembersResetPasswordTokensService } from './members-reset-password-tokens.service';
import { UserSessionsModule } from '../sessions/user-sessions/user-sessions.module';

@Module({
  imports: [TypeOrmModule.forFeature([MembersResetPasswordToken]), UserSessionsModule],
  controllers: [MembersResetPasswordTokensController],
  providers: [MembersResetPasswordTokensService],
  exports: [MembersResetPasswordTokensService],
})
export class MembersResetPasswordTokensModule {}
