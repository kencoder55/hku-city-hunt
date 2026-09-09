import { IsNotEmpty } from 'class-validator';

export class PhoneRegisterDto {
  @IsNotEmpty()
  captcha_token: string;

  @IsNotEmpty()
  phone: string;
}
