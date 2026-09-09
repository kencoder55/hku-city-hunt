import {
  Crud,
  CrudController,
  CrudRequest,
  Override,
  ParsedBody,
  ParsedRequest,
} from '@dataui/crud';
import { Body, Controller, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AdminAuthGuard } from 'src/tools/AdminAuthGuard';
import { RedemptionRecordsService } from './redemption-records.service';
import { CreateRedemptionRecordDto } from './dto/create-redemption-record.dto';
import { UpdateRedemptionRecordDto } from './dto/update-redemption-record.dto';
import { RedemptionRecord } from './entities/redemption-record.entity';

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
        eager: true,
        allow: ['id', 'name', 'email'],
      },
      product: {
        eager: true,
        allow: ['id', 'name_en', 'name_zh', 'type'],
      },
      redemptionCode: {
        eager: true,
        allow: ['id', 'code', 'type'],
      },
    },
  },
})
@UseGuards(AdminAuthGuard)
@Controller('admin/redemption-records')
export class RedemptionRecordsController implements CrudController<RedemptionRecord> {
  constructor(public service: RedemptionRecordsService) {}

  get base(): CrudController<RedemptionRecord> {
    return this;
  }
}
