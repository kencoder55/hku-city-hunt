import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsSlugConstraint implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments) {
    // Slug validation regex
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    return typeof value === 'string' && slugRegex.test(value);
  }

  defaultMessage(args: ValidationArguments) {
    return 'The value ($value) is not a valid slug. It should only contain lowercase letters, numbers, hyphens, and no spaces.';
  }
}

export function IsSlug(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsSlugConstraint,
    });
  };
}
