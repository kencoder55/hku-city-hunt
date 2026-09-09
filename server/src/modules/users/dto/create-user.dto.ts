import {
  ArrayNotEmpty,
  IsEmail,
  IsEmpty,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';
import { User } from '../entities/user.entity';

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

export class CreateUserDto {
  @IsEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsPassword()
  @IsOptional()
  password: string;

  @IsNumber(
    {
      allowNaN: false,
    },
    {
      each: true,
    },
  )
  @ArrayNotEmpty()
  roles: number[];

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
