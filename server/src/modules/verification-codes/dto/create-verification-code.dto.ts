export class CreateVerificationCodeDto {
  id: number;
  code: string;
  member_id: number;
  type: string;
  target_value: string;
  expires_at: Date;
  used: boolean;
  created_at: Date;
  deleted_at: Date | null;
}
