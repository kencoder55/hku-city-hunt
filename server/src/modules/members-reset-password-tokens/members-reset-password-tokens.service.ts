import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MembersResetPasswordToken } from './entities/members-reset-password-token.entity';

@Injectable()
export class MembersResetPasswordTokensService extends TypeOrmCrudService<MembersResetPasswordToken> {
  constructor(
    @InjectRepository(MembersResetPasswordToken)
    repo: Repository<MembersResetPasswordToken>,
  ) {
    super(repo);
  }

  async createRecord(memberId: number, token: string, expiresAt: Date) {
    const record = this.repo.create({
      member_id: memberId,
      token,
      expires_at: expiresAt,
      is_used: false,
    });

    return this.repo.save(record);
  }

  async markTokenAsUsed(token: string) {
    const record = await this.repo.findOne({ where: { token } });
    if (record) {
      record.is_used = true;
      await this.repo.save(record);
    }
  }

  async getValidToken(token: string) {
    const record = await this.repo.findOne({ where: { token, is_used: false } });
    if (record && record.expires_at > new Date()) {
      return record;
    }
    return null;
  }
}
