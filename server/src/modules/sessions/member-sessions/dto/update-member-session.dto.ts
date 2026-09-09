import { PartialType } from '@nestjs/swagger';
import { CreateMemberSessionDto } from './create-member-session.dto';

export class UpdateMemberSessionDto extends PartialType(CreateMemberSessionDto) {}
