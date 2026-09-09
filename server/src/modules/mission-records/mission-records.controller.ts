import { Crud, CrudController } from '@dataui/crud';
import { Controller, UseGuards } from '@nestjs/common';
import { AdminAuthGuard } from 'src/tools/AdminAuthGuard';
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
      member: {
        eager: true,
        allow: ['id', 'name', 'email'],
      },
      mission: {
        eager: true,
      },
    },
  },
  routes: {},
})
@UseGuards(AdminAuthGuard)
@Controller('admin/mission-records')
export class MissionRecordsController implements CrudController<MissionRecord> {
  constructor(public service: MissionRecordsService) {}

  get base(): CrudController<MissionRecord> {
    return this;
  }
}
