import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RedemptionRecord } from './entities/redemption-record.entity';
import { CreateRedemptionRecordDto } from './dto/create-redemption-record.dto';

@Injectable()
export class RedemptionRecordsService extends TypeOrmCrudService<RedemptionRecord> {
  constructor(
    @InjectRepository(RedemptionRecord)
    repo: Repository<RedemptionRecord>,
  ) {
    super(repo);
  }

  async findById(id: number): Promise<RedemptionRecord> {
    return await this.repo.findOne({
      where: { id },
      relations: ['member', 'product', 'redemptionCode'],
    });
  }

  async findByMemberId(memberId: number): Promise<RedemptionRecord[]> {
    return await this.repo.find({
      where: { member_id: memberId },
      relations: ['member', 'product', 'redemptionCode'],
      order: { created_at: 'DESC' },
    });
  }

  async createRecord(createDto: CreateRedemptionRecordDto): Promise<RedemptionRecord> {
    const record = this.repo.create(createDto);
    return await this.repo.save(record);
  }

  async hasRedeemedProduct(memberId: number, productId: number): Promise<boolean> {
    const count = await this.repo.count({
      where: {
        member_id: memberId,
        product_id: productId,
      },
    });
    return count > 0;
  }

  async findByMemberAndProduct(memberId: number, productId: number): Promise<RedemptionRecord> {
    return await this.repo.findOne({
      where: {
        member_id: memberId,
        product_id: productId,
      },
      relations: ['member', 'product', 'redemptionCode'],
      order: { created_at: 'DESC' },
    });
  }
}
