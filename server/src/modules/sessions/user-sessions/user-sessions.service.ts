import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { UserSession } from './entities/user-session.entity';

@Injectable()
export class UserSessionsService extends TypeOrmCrudService<UserSession> {
  constructor(
    @InjectRepository(UserSession)
    repo: Repository<UserSession>,
  ) {
    super(repo);
  }

  async saveSession(userId: number, token: string) {
    // remove expired session
    this.repo
      .createQueryBuilder()
      .delete()
      .where('expired_at < :expired_at', { expired_at: new Date() })
      .execute();

    // 1 day
    const expiredAt = new Date();

    expiredAt.setDate(expiredAt.getDate() + 1);

    return await this.repo.save({
      user_id: userId,
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
