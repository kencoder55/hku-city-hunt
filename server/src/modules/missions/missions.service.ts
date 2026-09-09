import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MissionRecordsService } from '../mission-records/mission-records.service';
import { MemberRewardsService } from '../member-rewards/member-rewards.service';
import { Mission } from './entities/mission.entity';

@Injectable()
export class MissionsService extends TypeOrmCrudService<Mission> {
  private readonly logger = new Logger(MissionsService.name);
  private readonly webUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  private readonly revalidationSecret = process.env.REVALIDATION_SECRET;

  // Simple in-memory TTL cache for mission list (60 seconds)
  private missionListCache: { data: Mission[]; cachedAt: number } | null = null;
  private readonly CACHE_TTL_MS = 60_000;

  // Cooldown between any mission completions (regardless of which mission)
  private readonly BETWEEN_MISSIONS_COOLDOWN_SECONDS = 60 * 5; // 5 minutes

  async findAllCached(): Promise<Mission[]> {
    const now = Date.now();
    if (this.missionListCache && now - this.missionListCache.cachedAt < this.CACHE_TTL_MS) {
      return this.missionListCache.data;
    }
    const data = await this.repo.find();
    this.missionListCache = { data, cachedAt: now };
    return data;
  }

  invalidateMissionListCache() {
    this.missionListCache = null;
  }

  constructor(
    @InjectRepository(Mission)
    repo: Repository<Mission>,
    private missionRecordsService: MissionRecordsService,
    private memberRewardsService: MemberRewardsService,
    private readonly httpService: HttpService,
  ) {
    super(repo);
  }

  async revalidateWebCache(action: string = 'missions', slug: string = null): Promise<any> {
    // Invalidate in-memory cache so next request fetches fresh data
    this.invalidateMissionListCache();
    try {
      const response = await this.httpService.axiosRef.post(
        `${this.webUrl}/api/revalidate`,
        { secret: this.revalidationSecret, action, slug },
        { headers: { 'Content-Type': 'application/json' }, timeout: 10000 },
      );
      this.logger.log(`Web cache revalidated: action=${action}, slug=${slug}`);
      return response.data;
    } catch (error) {
      this.logger.error(`Error revalidating web cache: ${error?.message}`);
      throw new Error(error?.response?.data?.message || 'Failed to revalidate web cache');
    }
  }

  async findBySlug(slug: string): Promise<Mission> {
    const mission = await this.repo.findOne({ where: { slug } });

    if (!mission) {
      return null;
    }

    return mission;
  }

  async findByType(type: string): Promise<Mission> {
    const mission = await this.repo.findOne({ where: { type } });

    if (!mission) {
      return null;
    }

    return mission;
  }

  async finishMission(mission: Mission, memberId: number, result: any) {
    // Cooldown check: member must wait between completing any missions (anti-script)
    const latestRecord = await this.missionRecordsService.findLatestRecordByMember(memberId);
    if (latestRecord) {
      const secondsSinceLast = (Date.now() - new Date(latestRecord.created_at).getTime()) / 1000;
      if (secondsSinceLast < this.BETWEEN_MISSIONS_COOLDOWN_SECONDS) {
        throw new BadRequestException('error.mission_completion_too_fast');
      }
    }

    // Reward guard: check before inserting (optimistic, backed by DB unique constraint)
    const alreadyRewarded = await this.memberRewardsService.hasRewardForMission(
      memberId,
      mission.id,
    );

    // Create mission record
    const missionRecord = await this.missionRecordsService.insertMissionRecord(
      mission,
      memberId,
      result,
    );

    // Give reward only if not already rewarded.
    // giveReward is idempotent: the DB unique constraint on (member_id, mission_id)
    // ensures only one reward row is ever inserted even under concurrent requests.
    if (!alreadyRewarded) {
      await this.memberRewardsService.giveReward(memberId, mission.id, missionRecord.id);
    }

    return missionRecord;
  }
}
