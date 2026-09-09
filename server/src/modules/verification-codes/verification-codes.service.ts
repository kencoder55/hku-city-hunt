import { TypeOrmCrudService } from '@dataui/crud-typeorm/lib/typeorm-crud.service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { VerificationCode } from './entities/verification-code.entity';

@Injectable()
export class VerificationCodesService extends TypeOrmCrudService<VerificationCode> {
  constructor(
    @InjectRepository(VerificationCode)
    repo: Repository<VerificationCode>,
  ) {
    super(repo);
  }

  async createVerificationCode(targetValue: string, code: string, type: string, expiresAt: Date) {
    // if there is an existing code for the targetValue and type, delete it first
    await this.repo.softDelete({
      target_value: targetValue,
      type: type,
    });

    const verificationCode = this.repo.create({
      target_value: targetValue,
      code: code,
      type: type,
      expires_at: expiresAt,
    });

    return this.repo.save(verificationCode);
  }

  async validateVerificationCode(email: string, code: string, type: string): Promise<boolean> {
    const record = await this.repo.findOne({
      where: {
        target_value: email,
        code: code,
        type: type,
        used: false,
        expires_at: MoreThan(new Date()),
      },
    });

    if (record) {
      // mark as used
      record.used = true;
      await this.repo.save(record);
      return true;
    } else {
      return false;
    }
  }

  async findLastVerificationCode(
    targetValue: string,
    type: string,
  ): Promise<VerificationCode | null> {
    return this.repo.findOne({
      where: {
        target_value: targetValue,
        type: type,
      },
      order: {
        created_at: 'DESC',
      },
    });
  }
}
