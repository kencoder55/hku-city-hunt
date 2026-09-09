import { Crud, CrudController } from '@dataui/crud';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AdminAuthGuard } from 'src/tools/AdminAuthGuard';
import { CreateMissionDto } from './dto/create-mission.dto';
import { UpdateMissionDto } from './dto/update-mission.dto';
import { Mission } from './entities/mission.entity';
import { MissionsService } from './missions.service';

@Crud({
  model: {
    type: Mission,
  },
  dto: {
    create: CreateMissionDto,
    update: UpdateMissionDto,
  },
  query: {
    alwaysPaginate: true,
  },
  routes: {},
})
@UseGuards(AdminAuthGuard)
@Controller('admin/missions')
export class MissionsController implements CrudController<Mission> {
  constructor(public service: MissionsService) {}

  get base(): CrudController<Mission> {
    return this;
  }

  @Post('revalidate')
  async revalidateCache(@Body() body: { action?: string; slug?: string }) {
    const { action = 'missions', slug = null } = body;
    const result = await this.service.revalidateWebCache(action, slug);
    return { success: true, result };
  }
}
