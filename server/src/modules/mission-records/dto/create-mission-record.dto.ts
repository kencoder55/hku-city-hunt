import { IsEmpty, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateMissionRecordDto {
  @IsEmpty()
  id: number;

  @IsNotEmpty()
  slug: string;

  @IsNumber()
  @IsNotEmpty()
  mission_id: number;

  @IsNumber()
  @IsNotEmpty()
  member_id: number;

  @IsOptional()
  result: string;

  @IsEmpty()
  created_at: Date;
}
