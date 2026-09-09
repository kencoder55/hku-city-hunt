import { Crud, CrudController } from '@dataui/crud';
import { Controller, Get, Headers, Query, Req, UseGuards } from '@nestjs/common';
import { WebAuthGuard } from 'src/tools/WebAuthGuard';
import { CreateMemberWellbeingDto } from './dto/create-member-wellbeing.dto';
import { UpdateMemberWellbeingDto } from './dto/update-member-wellbeing.dto';
import { MemberWellbeing } from './entities/member-wellbeing.entity';
import { MemberWellbeingService } from './member-wellbeing.service';
import { Request } from 'express';

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
  },
  routes: {
    only: ['getManyBase', 'createOneBase'],
  },
})
@UseGuards(WebAuthGuard)
@Controller('web/member-wellbeing')
export class MemberWellbeingWebController implements CrudController<MemberWellbeing> {
  constructor(public service: MemberWellbeingService) {}

  get base(): CrudController<MemberWellbeing> {
    return this;
  }

  @Get('my')
  async getMyWellbeing(
    @Req() request: Request,
    @Query('page') page: string = '1',
    @Query('page_size') pageSize: string,
  ) {
    try {
      const memberId = request.member.id;
      const currentPage = parseInt(page) || 1;
      const limit = pageSize ? parseInt(pageSize) : null;

      const { data, total, pageCount } = await this.service.findMyPaginatedRecords(
        memberId,
        currentPage,
        limit,
      );

      return {
        data,
        total,
        page: currentPage,
        pageCount,
      };
    } catch (error) {
      console.error('Get my wellbeing error:', error);
      throw error;
    }
  }
}
