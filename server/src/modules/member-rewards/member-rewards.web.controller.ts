import {
  Crud,
  CrudController,
  CrudRequest,
  GetManyDefaultResponse,
  Override,
  ParsedRequest,
} from '@dataui/crud';
import { Controller, Get, Headers, Param, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { getTranslationField } from 'src/tools/CommonTools';
import { WebAuthGuard } from 'src/tools/WebAuthGuard';
import { CreateMemberRewardDto } from './dto/create-member-reward.dto';
import { UpdateMemberRewardDto } from './dto/update-member-reward.dto';
import { MemberReward } from './entities/member-reward.entity';
import { MemberRewardsService } from './member-rewards.service';

@Crud({
  model: {
    type: MemberReward,
  },
  dto: {
    create: CreateMemberRewardDto,
    update: UpdateMemberRewardDto,
  },
  query: {
    alwaysPaginate: true,
    join: {
      member: {
        eager: false,
      },
      mission: {
        eager: true,
      },
      missionRecord: {
        eager: false,
      },
    },
  },
  routes: {
    only: ['getOneBase', 'getManyBase'],
  },
})
@UseGuards(WebAuthGuard)
@Controller('web/member-rewards')
export class MemberRewardsWebController implements CrudController<MemberReward> {
  constructor(public service: MemberRewardsService) {}

  get base(): CrudController<MemberReward> {
    return this;
  }
}
