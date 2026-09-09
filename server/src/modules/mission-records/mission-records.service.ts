import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from 'moment';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Mission } from '../missions/entities/mission.entity';
import { MissionRecord } from './entities/mission-record.entity';

@Injectable()
export class MissionRecordsService extends TypeOrmCrudService<MissionRecord> {
  constructor(
    @InjectRepository(MissionRecord)
    repo: Repository<MissionRecord>,
  ) {
    super(repo);
  }

  async insertMissionRecord(
    mission: Mission,
    memberId: number,
    result: any,
  ): Promise<MissionRecord> {
    // create slug, format: YYMMDD-HHmmss-MemberID-MissionID-random6num
    const timestamp = moment().format('YYMMDD');
    const slug = `${timestamp}-${memberId}-${mission.id}-${uuidv4()}`;

    const missionRecord = this.repo.create({
      slug: slug,
      mission_id: mission.id,
      member_id: memberId,
      result: JSON.stringify(result),
    });

    return await this.repo.save(missionRecord);
  }

  async findBySlug(slug: string): Promise<MissionRecord> {
    const missionRecord = await this.repo.findOne({
      where: { slug },
      relations: ['mission'],
    });

    if (!missionRecord) {
      return null;
    }

    return missionRecord;
  }

  async countMemberMissionRecords(memberId: number, missionId: number): Promise<number> {
    return await this.repo.count({
      where: {
        member_id: memberId,
        mission_id: missionId,
      },
    });
  }

  async findLatestMemberMissionRecord(
    memberId: number,
    missionId: number,
  ): Promise<MissionRecord | null> {
    return await this.repo.findOne({
      where: { member_id: memberId, mission_id: missionId },
      order: { created_at: 'DESC' },
    });
  }

  /**
   * Count how many missions this member has completed across ALL missions
   * within the given time window (in seconds).
   */
  async countRecentMemberRecords(memberId: number, withinSeconds: number): Promise<number> {
    const since = new Date(Date.now() - withinSeconds * 1000);
    return await this.repo
      .createQueryBuilder('record')
      .where('record.member_id = :memberId', { memberId })
      .andWhere('record.created_at >= :since', { since })
      .getCount();
  }

  /** Find the most recently completed mission record for a member, across all missions. */
  async findLatestRecordByMember(memberId: number): Promise<MissionRecord | null> {
    return await this.repo.findOne({
      where: { member_id: memberId },
      order: { created_at: 'DESC' },
    });
  }

  async findMyPaginatedRecords(
    memberId: number,
    page: number,
    limit: number | null,
  ): Promise<{ data: MissionRecord[]; total: number; pageCount: number }> {
    const dataQuery = this.repo
      .createQueryBuilder('record')
      .leftJoinAndSelect('record.mission', 'mission')
      .where('record.member_id = :memberId', { memberId })
      .orderBy('record.id', 'DESC');

    if (limit) {
      dataQuery.take(limit).skip((page - 1) * limit);
    }

    const [total, data] = await Promise.all([
      this.repo.count({ where: { member_id: memberId } }),
      dataQuery.getMany(),
    ]);

    return {
      data,
      total,
      pageCount: limit ? Math.ceil(total / limit) : 1,
    };
  }

  async findLetterRecordsCreatedOneYearAgo(): Promise<MissionRecord[]> {
    const startDate = new Date();
    startDate.setFullYear(startDate.getFullYear() - 1);
    startDate.setHours(0, 0, 0, 0); // start of the day, one year ago

    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 1); // start of the next day, one year ago

    return this.repo
      .createQueryBuilder('record')
      .innerJoinAndSelect('record.mission', 'mission')
      .innerJoinAndSelect('record.member', 'member')
      .where('mission.type = :type', { type: 'letter' })
      .andWhere('record.created_at >= :startDate', { startDate })
      .andWhere('record.created_at < :endDate', { endDate })
      .getMany();
  }
}
