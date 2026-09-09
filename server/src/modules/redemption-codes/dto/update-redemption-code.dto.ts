import { PartialType } from '@nestjs/swagger';
import { CreateRedemptionCodeDto } from './create-redemption-code.dto';

export class UpdateRedemptionCodeDto extends PartialType(CreateRedemptionCodeDto) {}
