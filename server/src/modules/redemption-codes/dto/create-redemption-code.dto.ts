import { IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateRedemptionCodeDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  type: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  code: string;

  @IsOptional()
  @IsBoolean()
  is_used?: boolean;

  @IsOptional()
  created_by?: number;

  @IsOptional()
  updated_by?: number;
}
