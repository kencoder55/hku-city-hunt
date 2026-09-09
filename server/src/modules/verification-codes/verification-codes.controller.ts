import { Crud, CrudController } from '@dataui/crud';
import { Controller, UseGuards } from '@nestjs/common';
import { AdminAuthGuard } from 'src/tools/AdminAuthGuard';
import { CreateVerificationCodeDto } from './dto/create-verification-code.dto';
import { UpdateVerificationCodeDto } from './dto/update-verification-code.dto';
import { VerificationCode } from './entities/verification-code.entity';
import { VerificationCodesService } from './verification-codes.service';

@Crud({
  model: {
    type: VerificationCode,
  },
  dto: {
    create: CreateVerificationCodeDto,
    update: UpdateVerificationCodeDto,
  },
  query: {
    softDelete: true,
  },
  routes: {
    only: [null],
  },
})
@UseGuards(AdminAuthGuard)
@Controller('admin/verification-codes')
export class VerificationCodesController implements CrudController<VerificationCode> {
  constructor(public service: VerificationCodesService) {}

  get base(): CrudController<VerificationCode> {
    return this;
  }
}
