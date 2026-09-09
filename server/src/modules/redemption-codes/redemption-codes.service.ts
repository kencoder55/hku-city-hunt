import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RedemptionCode } from './entities/redemption-code.entity';

@Injectable()
export class RedemptionCodesService extends TypeOrmCrudService<RedemptionCode> {
  constructor(
    @InjectRepository(RedemptionCode)
    repo: Repository<RedemptionCode>,
  ) {
    super(repo);
  }

  async findById(id: number): Promise<RedemptionCode> {
    return await this.repo.findOne({ where: { id } });
  }

  async findByCode(code: string): Promise<RedemptionCode> {
    return await this.repo.findOne({ where: { code } });
  }

  async markAsUsed(id: number, userId: number): Promise<RedemptionCode> {
    const redemptionCode = await this.findById(id);

    if (!redemptionCode) {
      throw new Error('error.redemption_code.not_found');
    }

    if (redemptionCode.is_used) {
      throw new Error('error.redemption_code.already_used');
    }

    // if the type is 'eslite', do not mark it as used, as it can be reused for multiple redemption records
    if (redemptionCode.type === 'eslite') {
      return redemptionCode;
    }

    redemptionCode.is_used = true;
    if (userId) {
      redemptionCode.updated_by = { id: userId } as any;
    }

    return await this.repo.save(redemptionCode);
  }

  async findAvailableCodeByType(type: string): Promise<RedemptionCode> {
    return await this.repo.findOne({
      where: {
        type,
        is_used: false,
      },
    });
  }
}
