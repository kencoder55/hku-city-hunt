import { PartialType } from '@nestjs/mapped-types';
import { CreateMemberRewardDto } from './create-member-reward.dto';

export class UpdateMemberRewardDto extends PartialType(CreateMemberRewardDto) {}
