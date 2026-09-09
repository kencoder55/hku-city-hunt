import {
  Crud,
  CrudController,
  CrudRequest,
  GetManyDefaultResponse,
  Override,
  ParsedRequest,
} from '@dataui/crud';
import { Controller, Get, Headers, Param, Query, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { Public } from 'src/decorators/public.decorator';
import { getTranslationField } from 'src/tools/CommonTools';
import { WebAuthGuard } from 'src/tools/WebAuthGuard';
import { MemberRewardsService } from '../member-rewards/member-rewards.service';
import { CreateMissionRecordDto } from './dto/create-mission-record.dto';
import { UpdateMissionRecordDto } from './dto/update-mission-record.dto';
import { MissionRecord } from './entities/mission-record.entity';
import { MissionRecordsService } from './mission-records.service';

@Crud({
  model: {
    type: MissionRecord,
  },
  dto: {
    create: CreateMissionRecordDto,
    update: UpdateMissionRecordDto,
  },
  query: {
    alwaysPaginate: true,
    join: {
      mission: {
        eager: true,
      },
    },
  },
  routes: {
    only: ['getManyBase', 'getOneBase'],
  },
})
@UseGuards(WebAuthGuard)
@Controller('web/mission-records')
export class MissionRecordsWebController implements CrudController<MissionRecord> {
  constructor(
    public service: MissionRecordsService,
    private memberRewardsService: MemberRewardsService,
  ) {}

  get base(): CrudController<MissionRecord> {
    return this;
  }

  @Get()
  @Override()
  async getMany(
    @ParsedRequest() crudRequest: CrudRequest,
    @Headers('accept-language') language: string,
  ) {
    try {
      const response = (await this.base.getManyBase(
        crudRequest,
      )) as GetManyDefaultResponse<MissionRecord>;

      const data = response.data;

      const nameField = getTranslationField('name', language || 'en');
      const descField = getTranslationField('description', language || 'en');
      const wellnessField = getTranslationField('wellness_message', language || 'en');
      const addressField = getTranslationField('address', language || 'en');

      const rewardedSet = await this.memberRewardsService.getRewardedRecordIdsSet(
        data.map(r => r.id),
      );

      const translatedData = await Promise.all(
        data.map(async record => {
          const mission = record.mission;

          // Check if THIS mission record earned a reward (i.e., was it the first completion)
          const isRewardedRecord = rewardedSet.has(record.id);

          return {
            id: record.id,
            slug: record.slug,
            mission_id: record.mission_id,
            member_id: record.member_id,
            result: record.result,
            created_at: record.created_at,
            rewarded: isRewardedRecord,
            mission: mission
              ? {
                  id: mission.id,
                  slug: mission.slug,
                  code: mission.code,
                  name: mission[nameField] || mission.name_zh || mission.name_en,
                  type: mission.type,
                  description:
                    mission[descField] || mission.description_zh || mission.description_en,
                  wellness_message:
                    mission[wellnessField] ||
                    mission.wellness_message_zh ||
                    mission.wellness_message_en,
                  address: mission[addressField] || mission.address_zh || mission.address_en,
                }
              : null,
          };
        }),
      );

      return {
        ...response,
        data: translatedData,
      };
    } catch (error) {
      console.error('Get many missions error:', error);
      throw error;
    }
  }

  @Get('my')
  async getMyMissionRecords(
    @Req() request: Request,
    @Query('page') page: string = '1',
    @Query('page_size') pageSize: string,
    @Headers('accept-language') language: string,
  ) {
    try {
      const memberId = request.member.id;
      const currentPage = parseInt(page) || 1;
      const limit = pageSize ? parseInt(pageSize) : null;

      const {
        data: records,
        total,
        pageCount,
      } = await this.service.findMyPaginatedRecords(memberId, currentPage, limit);

      const nameField = getTranslationField('name', language || 'en');
      const descField = getTranslationField('description', language || 'en');
      const wellnessField = getTranslationField('wellness_message', language || 'en');
      const addressField = getTranslationField('address', language || 'en');

      const rewardedSet = await this.memberRewardsService.getRewardedRecordIdsSet(
        records.map(r => r.id),
      );

      const translatedData = await Promise.all(
        records.map(async record => {
          const mission = record.mission;
          const isRewardedRecord = rewardedSet.has(record.id);

          return {
            id: record.id,
            slug: record.slug,
            mission_id: record.mission_id,
            member_id: record.member_id,
            result: record.result,
            created_at: record.created_at,
            rewarded: isRewardedRecord,
            mission: mission
              ? {
                  id: mission.id,
                  slug: mission.slug,
                  code: mission.code,
                  name: mission[nameField] || mission.name_zh || mission.name_en,
                  type: mission.type,
                  description:
                    mission[descField] || mission.description_zh || mission.description_en,
                  wellness_message:
                    mission[wellnessField] ||
                    mission.wellness_message_zh ||
                    mission.wellness_message_en,
                  address: mission[addressField] || mission.address_zh || mission.address_en,
                }
              : null,
          };
        }),
      );

      return {
        data: translatedData,
        total,
        page: currentPage,
        pageCount,
      };
    } catch (error) {
      console.error('Get my mission records error:', error);
      throw error;
    }
  }

  @Public()
  @Get(':slug')
  async getMissionRecordBySlug(
    @Param('slug') slug: string,
    @Headers('accept-language') language: string,
  ): Promise<any> {
    const missionRecord = await this.service.findBySlug(slug);

    console.log('Requested mission record slug:', slug, 'Found record:', missionRecord);

    if (!missionRecord) {
      return null;
    }

    const nameField = getTranslationField('name', language || 'en');
    const descField = getTranslationField('description', language || 'en');
    const wellnessField = getTranslationField('wellness_message', language || 'en');
    const addressField = getTranslationField('address', language || 'en');

    // Check if THIS mission record earned a reward (i.e., was it the first completion)
    const isRewardedRecord = await this.memberRewardsService.isRewardedRecord(missionRecord.id);

    return {
      id: missionRecord.id,
      slug: missionRecord.slug,
      mission_id: missionRecord.mission_id,
      member_id: missionRecord.member_id,
      result: missionRecord.result,
      created_at: missionRecord.created_at,
      rewarded: isRewardedRecord,
      mission: missionRecord.mission
        ? {
            id: missionRecord.mission.id,
            slug: missionRecord.mission.slug,
            name:
              missionRecord.mission[nameField] ||
              missionRecord.mission.name_zh ||
              missionRecord.mission.name_en,
            type: missionRecord.mission.type,
            description:
              missionRecord.mission[descField] ||
              missionRecord.mission.description_zh ||
              missionRecord.mission.description_en,
            wellness_message:
              missionRecord.mission[wellnessField] ||
              missionRecord.mission.wellness_message_zh ||
              missionRecord.mission.wellness_message_en,
            address:
              missionRecord.mission[addressField] ||
              missionRecord.mission.address_zh ||
              missionRecord.mission.address_en,
            cover_image: missionRecord.mission.cover_image,
            start_time: missionRecord.mission.start_time,
            end_time: missionRecord.mission.end_time,
            category: missionRecord.mission.category,
            location: missionRecord.mission.location,
            parameter: missionRecord.mission.parameter,
          }
        : null,
    };
  }
}
