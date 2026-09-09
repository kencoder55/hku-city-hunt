import { Crud, CrudController } from '@dataui/crud';
import { Controller, UseGuards } from '@nestjs/common';
import { AdminAuthGuard } from 'src/tools/AdminAuthGuard';
import { CreateMembersResetPasswordTokenDto } from './dto/create-members-reset-password-token.dto';
import { UpdateMembersResetPasswordTokenDto } from './dto/update-members-reset-password-token.dto';
import { MembersResetPasswordToken } from './entities/members-reset-password-token.entity';
import { MembersResetPasswordTokensService } from './members-reset-password-tokens.service';

@Crud({
  model: {
    type: MembersResetPasswordToken,
  },
  dto: {
    create: CreateMembersResetPasswordTokenDto,
    update: UpdateMembersResetPasswordTokenDto,
  },
  query: {
    softDelete: true,
  },
  routes: {
    only: [null],
  },
})
@UseGuards(AdminAuthGuard)
@Controller('admin/members-reset-password-tokens')
export class MembersResetPasswordTokensController implements CrudController<MembersResetPasswordToken> {
  constructor(public service: MembersResetPasswordTokensService) {}

  get base(): CrudController<MembersResetPasswordToken> {
    return this;
  }
}
