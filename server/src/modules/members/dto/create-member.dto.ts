import {
  IsEmail,
  IsEmpty,
  IsNotEmpty,
  IsOptional,
  IsString,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';
import { User } from 'src/modules/users/entities/user.entity';

function IsPassword(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsPassword',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: string) {
          // check at least 8 characters
          const hasMinLength = value.length >= 8;

          // check at least one uppercase letter
          const hasUppercase = /[A-Z]/.test(value);

          // check at least one lowercase letter
          const hasLowercase = /[a-z]/.test(value);

          // check at least one digit
          const hasDigit = /\d/.test(value);

          // check at least one special character
          const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(value);

          return hasMinLength && hasUppercase && hasLowercase && hasDigit && hasSpecial;
        },
        defaultMessage() {
          return 'Password must contain at least 8 characters, 1 uppercase letter, 1 lowercase letter, 1 digit and 1 special character';
        },
      },
    });
  };
}

export class CreateMemberDto {
  @IsEmpty()
  id: number;

  @IsOptional()
  avatar_id: number;

  @IsString()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsOptional()
  phone: string;

  @IsString()
  @IsOptional()
  // @IsPassword()
  password: string;

  @IsOptional()
  age: string;

  @IsOptional()
  gender: string;

  @IsEmpty()
  is_email_verified: boolean;

  @IsEmpty()
  is_sms_verified: boolean;

  @IsEmpty()
  is_blocked: boolean;

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
