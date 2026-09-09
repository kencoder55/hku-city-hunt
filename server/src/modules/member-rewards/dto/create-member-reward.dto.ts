import { IsBoolean, IsInt, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateMemberRewardDto {
  @IsNotEmpty()
  @IsInt()
  member_id: number;

  @IsNotEmpty()
  @IsInt()
  mission_id: number;

  @IsNotEmpty()
  @IsInt()
  mission_record_id: number;

  @IsOptional()
  @IsBoolean()
  is_used?: boolean;
}
