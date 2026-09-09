import { Crud, CrudController } from '@dataui/crud';
import { Controller, UseGuards } from '@nestjs/common';
import { WebAuthGuard } from 'src/tools/WebAuthGuard';
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
  },
  routes: {
    only: ['getOneBase'],
  },
})
@UseGuards(WebAuthGuard)
@Controller('web/redemption-codes')
export class RedemptionCodesWebController implements CrudController<RedemptionCode> {
  constructor(public service: RedemptionCodesService) {}

  get base(): CrudController<RedemptionCode> {
    return this;
  }
}
