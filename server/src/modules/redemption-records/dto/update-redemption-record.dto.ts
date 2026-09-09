import { PartialType } from '@nestjs/swagger';
import { CreateRedemptionRecordDto } from './create-redemption-record.dto';

export class UpdateRedemptionRecordDto extends PartialType(CreateRedemptionRecordDto) {}
