import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateMembersResetPasswordTokenDto {
  @ApiProperty()
  @IsNumber()
  @IsOptional()
  member_id?: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  token?: string;

  @ApiProperty()
  @IsDateString()
  @IsOptional()
  expires_at?: Date;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  is_used?: boolean;
}
