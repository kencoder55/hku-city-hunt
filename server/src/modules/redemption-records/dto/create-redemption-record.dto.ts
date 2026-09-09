import { IsEmpty, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { Member } from 'src/modules/members/entities/member.entity';
import { Product } from 'src/modules/products/entities/product.entity';
import { RedemptionCode } from 'src/modules/redemption-codes/entities/redemption-code.entity';

export class CreateRedemptionRecordDto {
  @IsNotEmpty()
  @IsInt()
  member_id: number;

  @IsOptional()
  @IsInt()
  product_id: number;

  @IsOptional()
  @IsInt()
  redemption_code_id: number;

  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  type: string;

  @IsOptional()
  @IsString()
  remark: string;
}
