import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSessionsModule } from 'src/modules/sessions/user-sessions/user-sessions.module';
import { VerificationCode } from './entities/verification-code.entity';
import { VerificationCodesController } from './verification-codes.controller';
import { VerificationCodesService } from './verification-codes.service';

@Module({
  imports: [TypeOrmModule.forFeature([VerificationCode]), UserSessionsModule],
  controllers: [VerificationCodesController],
  providers: [VerificationCodesService],
  exports: [VerificationCodesService],
})
export class VerificationCodesModule {}
