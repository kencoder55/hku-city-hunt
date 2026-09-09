import { Crud, CrudController } from '@dataui/crud';
import { Controller, UseGuards } from '@nestjs/common';
import { CreateMemberRewardDto } from './dto/create-member-reward.dto';
import { UpdateMemberRewardDto } from './dto/update-member-reward.dto';
import { MemberReward } from './entities/member-reward.entity';
import { MemberRewardsService } from './member-rewards.service';
import { AdminAuthGuard } from 'src/tools/AdminAuthGuard';

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
    },
  },
})
@UseGuards(AdminAuthGuard)
@Controller('admin/member-rewards')
export class MemberRewardsController implements CrudController<MemberReward> {
  constructor(public service: MemberRewardsService) {}

  get base(): CrudController<MemberReward> {
    return this;
  }
}
