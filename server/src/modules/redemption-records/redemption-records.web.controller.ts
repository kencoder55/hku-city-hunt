import { Crud, CrudController } from '@dataui/crud';
import { Controller, UseGuards } from '@nestjs/common';
import { WebAuthGuard } from 'src/tools/WebAuthGuard';
import { CreateRedemptionRecordDto } from './dto/create-redemption-record.dto';
import { UpdateRedemptionRecordDto } from './dto/update-redemption-record.dto';
import { RedemptionRecord } from './entities/redemption-record.entity';
import { RedemptionRecordsService } from './redemption-records.service';

@Crud({
  model: {
    type: RedemptionRecord,
  },
  dto: {
    create: CreateRedemptionRecordDto,
    update: UpdateRedemptionRecordDto,
  },
  query: {
    alwaysPaginate: true,
    join: {
      member: {
        eager: false,
      },
      product: {
        eager: true,
        allow: ['id', 'name_en', 'name_zh', 'type', 'cover_image'],
      },
      redemptionCode: {
        eager: true,
        allow: ['id', 'code', 'type'],
      },
    },
  },
  routes: {
    only: ['getOneBase', 'getManyBase'],
  },
})
@UseGuards(WebAuthGuard)
@Controller('web/redemption-records')
export class RedemptionRecordsWebController implements CrudController<RedemptionRecord> {
  constructor(public service: RedemptionRecordsService) {}

  get base(): CrudController<RedemptionRecord> {
    return this;
  }
}
