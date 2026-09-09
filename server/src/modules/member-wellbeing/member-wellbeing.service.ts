import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MemberWellbeing } from './entities/member-wellbeing.entity';

@Injectable()
export class MemberWellbeingService extends TypeOrmCrudService<MemberWellbeing> {
  constructor(
    @InjectRepository(MemberWellbeing)
    repo: Repository<MemberWellbeing>,
  ) {
    super(repo);
  }

  async findMyPaginatedRecords(
    memberId: number,
    page: number,
    limit: number | null,
  ): Promise<{ data: MemberWellbeing[]; total: number; pageCount: number }> {
    const query = this.repo
      .createQueryBuilder('wellbeing')
      .where('wellbeing.member_id = :memberId', { memberId })
      .orderBy('wellbeing.id', 'DESC');

    if (limit) {
      query.take(limit).skip((page - 1) * limit);
    }

    const [data, total] = await query.getManyAndCount();

    return {
      data,
      total,
      pageCount: limit ? Math.ceil(total / limit) : 1,
    };
  }
}
