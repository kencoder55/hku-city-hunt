import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MemberReward } from './entities/member-reward.entity';

@Injectable()
export class MemberRewardsService extends TypeOrmCrudService<MemberReward> {
  private readonly logger = new Logger(MemberRewardsService.name);

  constructor(
    @InjectRepository(MemberReward)
    repo: Repository<MemberReward>,
  ) {
    super(repo);
  }

  async giveReward(
    memberId: number,
    missionId: number,
    missionRecordId: number,
  ): Promise<MemberReward | null> {
    try {
      const memberReward = this.repo.create({
        member_id: memberId,
        mission_id: missionId,
        mission_record_id: missionRecordId,
        is_used: false,
      });
      return await this.repo.save(memberReward);
    } catch (error) {
      // Duplicate key: reward already exists (enforced by unique constraint)
      // This can happen under concurrent requests across multiple instances
      if (error?.code === 'ER_DUP_ENTRY' || error?.code === '23505') {
        this.logger.warn(`Duplicate reward skipped for member=${memberId} mission=${missionId}`);
        return null;
      }
      throw error;
    }
  }

  async markRewardAsUsed(rewardId: number): Promise<MemberReward> {
    const reward = await this.repo.findOne({ where: { id: rewardId } });

    if (!reward) {
      throw new Error('Reward not found');
    }

    reward.is_used = true;
    return await this.repo.save(reward);
  }

  async hasRewardForMission(memberId: number, missionId: number): Promise<boolean> {
    const count = await this.repo.count({
      where: {
        member_id: memberId,
        mission_id: missionId,
      },
    });

    return count > 0;
  }

  async getMemberRewards(memberId: number): Promise<MemberReward[]> {
    return await this.repo.find({
      where: { member_id: memberId },
      relations: ['mission'],
      order: { created_at: 'DESC' },
    });
  }

  async isRewardedRecord(missionRecordId: number): Promise<boolean> {
    const reward = await this.repo.findOne({
      where: {
        mission_record_id: missionRecordId,
      },
    });

    return !!reward;
  }

  async getRewardedRecordIdsSet(missionRecordIds: number[]): Promise<Set<number>> {
    if (missionRecordIds.length === 0) return new Set();

    const rewards = await this.repo
      .createQueryBuilder('r')
      .select('r.mission_record_id')
      .where('r.mission_record_id IN (:...ids)', { ids: missionRecordIds })
      .getMany();

    return new Set(rewards.map(r => r.mission_record_id));
  }
}
