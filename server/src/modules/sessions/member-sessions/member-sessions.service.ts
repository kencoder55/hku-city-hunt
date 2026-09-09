import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { LessThan, MoreThan, Repository } from 'typeorm';
import { MemberSession } from './entities/member-session.entity';

@Injectable()
export class MemberSessionsService extends TypeOrmCrudService<MemberSession> {
  private readonly logger = new Logger(MemberSessionsService.name);

  constructor(
    @InjectRepository(MemberSession)
    repo: Repository<MemberSession>,
  ) {
    super(repo);
  }

  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async cleanupExpiredSessions() {
    const result = await this.repo.delete({ expired_at: LessThan(new Date()) });
    this.logger.log(`Cleaned up ${result.affected} expired member sessions`);
  }

  async saveSession(memberId: number, token: string) {
    // 60 day
    const expiredAt = new Date();

    expiredAt.setDate(expiredAt.getDate() + 60);

    return await this.repo.save({
      member_id: memberId,
      token: token,
      expired_at: expiredAt,
    });
  }

  async verifySession(token: string) {
    return await this.repo.findOne({
      where: {
        token: token,
        expired_at: MoreThan(new Date()),
      },
    });
  }
}
