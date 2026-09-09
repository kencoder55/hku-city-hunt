import { PartialType } from '@nestjs/swagger';
import { CreateMissionRecordDto } from './create-mission-record.dto';

export class UpdateMissionRecordDto extends PartialType(CreateMissionRecordDto) {}
