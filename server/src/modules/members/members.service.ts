import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import { MailerService } from '@nestjs-modules/mailer';
import { HttpService } from '@nestjs/axios';
import { BadRequestException, HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { VerificationCode } from 'src/modules/verification-codes/entities/verification-code.entity';
import { VerificationCodesService } from 'src/modules/verification-codes/verification-codes.service';
import { comparePasswordWithBcrypt, covertingPasswordToBcrypt } from 'src/tools/CommonTools';
import { Repository } from 'typeorm';
import { MembersResetPasswordTokensService } from '../members-reset-password-tokens/members-reset-password-tokens.service';
import { MemberSessionsService } from '../sessions/member-sessions/member-sessions.service';
import { Member } from './entities/member.entity';
import * as crypto from 'crypto';
import * as dns from 'dns/promises';
import { BLOCKED_EMAIL_DOMAINS } from './data/blocked-email-domains';
@Injectable()
export class MembersService extends TypeOrmCrudService<Member> {
  private readonly logger = new Logger(MembersService.name);

  constructor(
    @InjectRepository(Member)
    repo: Repository<Member>,
    private jwtService: JwtService,
    private memberSessionsService: MemberSessionsService,
    private verificationCodesService: VerificationCodesService,
    private membersResetPasswordTokensService: MembersResetPasswordTokensService,
    private readonly mailerService: MailerService,
    private readonly httpService: HttpService,
  ) {
    super(repo);
  }

  async login(account: string, password: string) {
    const lowerCaseAccount = account.toLowerCase();

    // find member by email or phone and password
    const member = await this.repo.findOne({
      where: [{ email: lowerCaseAccount }, { phone: lowerCaseAccount }],
    });

    if (!member) {
      throw new BadRequestException('error.member.not_found');
    }

    if (member.is_blocked) {
      throw new BadRequestException('error.member.blocked');
    }

    const isPasswordMatching = comparePasswordWithBcrypt(password, member.password);

    if (!isPasswordMatching) {
      throw new BadRequestException('error.member.invalid_password');
    }

    const jwt = this.jwtService.sign({
      id: member.id,
      name: member.name,
    });

    // save jwt to session table
    this.memberSessionsService.saveSession(member.id, jwt);

    return {
      id: member.id,
      name: member.name,
      avatar_id: member.avatar_id,
      email: member.email,
      phone: member.phone,
      is_email_verified: member.is_email_verified,
      is_sms_verified: member.is_sms_verified,
      jwt: jwt,
    };
  }

  async checkEmailExist({ id, email }: { id?: number; email: string }) {
    const queryBuilder = this.repo.createQueryBuilder();

    queryBuilder.where('email = :email', {
      email,
    });

    if (id) {
      queryBuilder.andWhere('id != :id', { id });
    }

    const existing = await queryBuilder.getOne();

    if (existing) {
      throw new BadRequestException('error.member.email_exist');
    }

    return false;
  }

  checkEmailDomain(email: string): void {
    const domain = email.toLowerCase().split('@')[1];
    if (!domain) {
      throw new BadRequestException('error.member.email_invalid');
    }
    if (BLOCKED_EMAIL_DOMAINS.includes(domain)) {
      throw new BadRequestException('error.member.email_domain_blocked');
    }
  }

  async checkEmailMxRecord(email: string): Promise<void> {
    const domain = email.toLowerCase().split('@')[1];
    try {
      const records = await dns.resolveMx(domain);
      if (!records || records.length === 0) {
        throw new BadRequestException('error.member.email_domain_invalid');
      }
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      // dns lookup failed = domain doesn't exist or has no MX records
      throw new BadRequestException('error.member.email_domain_invalid');
    }
  }

  async checkPhoneExist({ id, phone }: { id?: number; phone: string }) {
    const queryBuilder = this.repo.createQueryBuilder();

    queryBuilder.where('phone = :phone', {
      phone,
    });

    if (id) {
      queryBuilder.andWhere('id != :id', { id });
    }

    const existing = await queryBuilder.getOne();

    if (existing) {
      throw new BadRequestException('error.member.phone_exist');
    }

    return false;
  }

  async generateVerificationCode(type: string, targetValue: string): Promise<VerificationCode> {
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10); // expires in 10 minutes

    const verificationCodeRecord: VerificationCode =
      await this.verificationCodesService.createVerificationCode(
        targetValue,
        verificationCode,
        type,
        expiresAt,
      );

    return verificationCodeRecord;
  }

  async canSendVerificationCode(type: string, targetValue: string): Promise<boolean> {
    const lastCode = await this.verificationCodesService.findLastVerificationCode(
      targetValue,
      type,
    );

    if (lastCode) {
      const now = new Date();
      const diffInSeconds = (now.getTime() - lastCode.created_at.getTime()) / 1000;

      if (diffInSeconds < 60) {
        throw new BadRequestException('error.phone_verification.too_many_requests');
      }
    }

    return true;
  }

  async sendVerificationEmail(memberName: string, email: string, code: string, language: string) {
    const lowerCaseLanguage = language ? language.toLowerCase() : 'en';

    const templatePath = path.join(
      __dirname,
      `../../templates/email/email-verification-${lowerCaseLanguage}.html`,
    );
    let htmlTemplate = fs.readFileSync(templatePath, 'utf-8');

    htmlTemplate = htmlTemplate
      .replace(/{{MEMBER_NAME}}/g, memberName || '')
      .replace(/{{VERIFICATION_CODE}}/g, code);

    const subject =
      lowerCaseLanguage === 'zh-hk'
        ? '電郵驗證通知：330 Day 2026–感．生活'
        : 'Email Verification: 330 Day 2026–Sense．To Live';

    try {
      await this.mailerService.sendMail({
        to: email,
        subject,
        html: htmlTemplate,
      });
    } catch (error) {
      console.error('Error sending verification email:', error);
      throw new BadRequestException('error.sending_email_failed');
    }
  }

  async verifyCode(email: string, code: string, type: string): Promise<boolean> {
    const isValid = await this.verificationCodesService.validateVerificationCode(email, code, type);

    return isValid;
  }

  async verifyCaptchaToken(captchaToken: string): Promise<boolean> {
    try {
      const response = await this.httpService.axiosRef.post(
        process.env.CLOUDFLARE_TURNSTILE_VERIFY_URL,
        {
          secret: process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY,
          response: captchaToken,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      return response.data.success;
    } catch (error) {
      this.logger.error('Captcha verification failed', JSON.stringify(error));
      throw new HttpException('Captcha verification failed', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async registerMember({
    avatar_id,
    name,
    email,
    phone,
    gender,
    age,
    password,
    isEmailValidated,
    isPhoneValidated,
    isBlocked,
  }: {
    avatar_id: number;
    name: string;
    email: string;
    phone: string;
    gender: string;
    age: string;
    password: string;
    isEmailValidated: boolean;
    isPhoneValidated: boolean;
    isBlocked: boolean;
  }): Promise<Member> {
    const lowerCaseEmail = email.toLowerCase();

    // hash password
    const hashedPassword = covertingPasswordToBcrypt(password);

    const newMember = this.repo.create({
      avatar_id: avatar_id,
      name: name,
      email: lowerCaseEmail,
      phone: phone,
      gender: gender,
      age: age,
      password: hashedPassword,
      is_email_verified: isEmailValidated,
      is_sms_verified: isPhoneValidated,
      is_blocked: isBlocked,
    });

    return this.repo.save(newMember);
  }

  async updateMemberEmailValidated(email: string, validated: boolean): Promise<void> {
    await this.repo.update({ email }, { is_email_verified: validated });
  }

  async updateMemberPhoneValidated(
    memberId: number,
    phone: string,
    validated: boolean,
  ): Promise<void> {
    await this.repo.update({ id: memberId }, { is_sms_verified: validated, phone: phone });
  }

  async sendForgotPasswordEmail(member: Member, language: string): Promise<void> {
    // Generate a reset password token (alphanumeric only, 128 characters)
    const token = crypto.randomBytes(64).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // token valid for 1 hour

    await this.membersResetPasswordTokensService.createRecord(member.id, token, expiresAt);

    // Send email with the reset link
    const resetLink = `${process.env.FRONTEND_URL}/members/forgot-password/change-password?token=${token}`;

    const lowerCaseLanguage = language ? language.toLowerCase() : 'en';

    // Load HTML template
    const templatePath = path.join(
      __dirname,
      `../../templates/email/forgot-password-${lowerCaseLanguage}.html`,
    );
    let htmlTemplate = fs.readFileSync(templatePath, 'utf-8');

    // Replace placeholders
    htmlTemplate = htmlTemplate
      .replace(/{{MEMBER_NAME}}/g, member.name || 'there')
      .replace(/{{RESET_LINK}}/g, resetLink);

    try {
      await this.mailerService.sendMail({
        to: member.email,
        subject: 'Password Reset Request',
        html: htmlTemplate,
      });
    } catch (error) {
      console.error('Error sending forgot password email:', error);
      throw new BadRequestException('error.sending_email_failed');
    }
  }

  async changePasswordWithToken(token: string, newPassword: string): Promise<void> {
    // Validate the token
    const validTokenRecord = await this.membersResetPasswordTokensService.getValidToken(token);

    if (!validTokenRecord) {
      throw new BadRequestException('error.invalid_or_expired_token');
    }

    // Hash the new password
    const hashedPassword = covertingPasswordToBcrypt(newPassword);

    // Update the member's password
    await this.repo.update({ id: validTokenRecord.member_id }, { password: hashedPassword });

    // Mark the token as used
    await this.membersResetPasswordTokensService.markTokenAsUsed(token);
  }
}
