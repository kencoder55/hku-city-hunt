import { PartialType } from '@nestjs/swagger';
import { CreateMembersResetPasswordTokenDto } from './create-members-reset-password-token.dto';

export class UpdateMembersResetPasswordTokenDto extends PartialType(CreateMembersResetPasswordTokenDto) {}
