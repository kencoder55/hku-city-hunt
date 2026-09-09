import { IsEmpty, IsNotEmpty, IsNumber, IsObject, IsOptional } from 'class-validator';

export class CreateMemberWellbeingDto {
  @IsEmpty()
  id: number;

  @IsNumber()
  @IsNotEmpty()
  member_id: number;

  @IsNumber()
  @IsNotEmpty()
  wellbeing_score: number;

  @IsObject()
  @IsOptional()
  survey_answers: Record<string, number>;

  @IsEmpty()
  created_at: Date;
}
