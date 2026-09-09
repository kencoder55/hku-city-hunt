import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';

export function covertingPasswordToSha1(password: string): string {
  return crypto.createHash('sha1').update(password).digest('hex');
}

export function covertingPasswordToBcrypt(password: string): string {
  const saltRounds = 12;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(password, salt);

  return hash;
}

export function comparePasswordWithBcrypt(password: string, hash: string): boolean {
  return bcrypt.compareSync(password, hash);
}

export function getTranslationField(field: string, language: string) {
  if (language === 'zh-HK') {
    return `${field}_zh`;
  } else if (language === 'en') {
    return `${field}_en`;
  } else {
    return `${field}_en`; // default to English
  }
}

export function jsonTransformer() {
  return {
    to: (value: string) => {
      if (typeof value === 'string') {
        return value;
      }
      if (Array.isArray(value)) {
        return JSON.stringify(value);
      }
      return JSON.stringify([]);
    },
    from: (value: any) => {
      if (typeof value === 'string') {
        try {
          return JSON.parse(value);
        } catch (e) {
          console.error('JSON parse error:', e);
          return [];
        }
      }
      if (Array.isArray(value)) {
        return value;
      }
      return [];
    },
  };
}
