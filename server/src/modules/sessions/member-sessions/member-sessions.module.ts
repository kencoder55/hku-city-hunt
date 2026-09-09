import { Module } from '@nestjs/common';
import { MemberSessionsService } from './member-sessions.service';
import { MemberSessionsController } from './member-sessions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemberSession } from './entities/member-session.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MemberSession])],
  controllers: [MemberSessionsController],
  providers: [MemberSessionsService],
  exports: [MemberSessionsService],
})
export class MemberSessionsModule {}
