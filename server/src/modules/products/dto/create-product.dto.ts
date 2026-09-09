import { IsEmpty, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';
import { User } from 'src/modules/users/entities/user.entity';

export class CreateProductDto {
  @IsEmpty()
  id: number;

  @IsNotEmpty()
  @IsString()
  type: string;

  @IsNotEmpty()
  @IsString()
  name_zh: string;

  @IsOptional()
  @IsString()
  name_en: string;

  @IsOptional()
  @IsString()
  description_zh: string;

  @IsOptional()
  @IsString()
  description_en: string;

  @IsOptional()
  @IsString()
  cover_image: string;

  @IsOptional()
  stock: number;

  @IsNotEmpty()
  required_rewards: number;

  @IsOptional()
  @IsString()
  redemption_date_zh: string;

  @IsOptional()
  @IsString()
  redemption_date_en: string;

  @IsOptional()
  @IsString()
  redemption_link: string;

  created_by: User;

  updated_by: User;

  @IsEmpty()
  deleted_by: User;

  @IsEmpty()
  created_at: Date;

  @IsEmpty()
  updated_at: Date;

  @IsEmpty()
  deleted_at: Date;
}
