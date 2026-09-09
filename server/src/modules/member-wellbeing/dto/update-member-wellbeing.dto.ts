import { PartialType } from '@nestjs/swagger';
import { CreateMemberWellbeingDto } from './create-member-wellbeing.dto';

export class UpdateMemberWellbeingDto extends PartialType(CreateMemberWellbeingDto) {}
