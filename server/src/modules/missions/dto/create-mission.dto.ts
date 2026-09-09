import { IsDate, IsEmpty, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMissionDto {
  @IsEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  name_zh: string;

  @IsString()
  @IsOptional()
  name_en: string;

  @IsString()
  @IsOptional()
  type: string;

  @IsString()
  @IsOptional()
  description_zh: string;

  @IsString()
  @IsOptional()
  description_en: string;

  @IsString()
  @IsOptional()
  wellness_message_zh: string;

  @IsString()
  @IsOptional()
  wellness_message_en: string;

  @IsString()
  @IsOptional()
  address_zh: string;

  @IsString()
  @IsOptional()
  address_en: string;

  @IsString()
  @IsOptional()
  cover_image: string;

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  start_time: Date;

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  end_time: Date;

  @IsString()
  @IsOptional()
  category: string;

  @IsString()
  @IsOptional()
  location: string;

  @IsString()
  @IsOptional()
  parameter: string;
}
