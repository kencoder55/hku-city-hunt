import { Crud, CrudController } from '@dataui/crud';
import { Controller, UseGuards } from '@nestjs/common';
import { AdminAuthGuard } from 'src/tools/AdminAuthGuard';
import { CreateRedemptionCodeDto } from './dto/create-redemption-code.dto';
import { UpdateRedemptionCodeDto } from './dto/update-redemption-code.dto';
import { RedemptionCode } from './entities/redemption-code.entity';
import { RedemptionCodesService } from './redemption-codes.service';

@Crud({
  model: {
    type: RedemptionCode,
  },
  dto: {
    create: CreateRedemptionCodeDto,
    update: UpdateRedemptionCodeDto,
  },
  query: {
    alwaysPaginate: true,
    softDelete: true,
    join: {
      created_by: {
        eager: true,
        allow: ['id', 'username'],
      },
      updated_by: {
        eager: true,
        allow: ['id', 'username'],
      },
    },
  },
})
@UseGuards(AdminAuthGuard)
@Controller('admin/redemption-codes')
export class RedemptionCodesController implements CrudController<RedemptionCode> {
  constructor(public service: RedemptionCodesService) {}

  get base(): CrudController<RedemptionCode> {
    return this;
  }
}
