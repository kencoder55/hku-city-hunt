import { Crud, CrudController } from '@dataui/crud';
import { Controller, UseGuards } from '@nestjs/common';
import { AdminAuthGuard } from 'src/tools/AdminAuthGuard';
import { CreateMemberWellbeingDto } from './dto/create-member-wellbeing.dto';
import { UpdateMemberWellbeingDto } from './dto/update-member-wellbeing.dto';
import { MemberWellbeing } from './entities/member-wellbeing.entity';
import { MemberWellbeingService } from './member-wellbeing.service';

@Crud({
  model: {
    type: MemberWellbeing,
  },
  dto: {
    create: CreateMemberWellbeingDto,
    update: UpdateMemberWellbeingDto,
  },
  query: {
    alwaysPaginate: true,
    join: {
      member_id: {
        eager: true,
        allow: ['id', 'name', 'email'],
      },
    },
  },
  routes: {},
})
@UseGuards(AdminAuthGuard)
@Controller('admin/member-wellbeing')
export class MemberWellbeingController implements CrudController<MemberWellbeing> {
  constructor(public service: MemberWellbeingService) {}

  get base(): CrudController<MemberWellbeing> {
    return this;
  }
}
