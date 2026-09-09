import { IsEmail, IsNotEmpty } from 'class-validator';

export class PhoneValidationDto {
  @IsNotEmpty()
  phone: string;

  @IsNotEmpty()
  code: string;
}
