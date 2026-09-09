import {
  Crud,
  CrudController,
  CrudRequest,
  Override,
  ParsedBody,
  ParsedRequest,
} from '@dataui/crud';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { Public } from 'src/decorators/public.decorator';
import { WebAuthGuard } from 'src/tools/WebAuthGuard';
import { WinstonModule } from 'nest-winston';
import { registrationWinstonConfig } from 'src/config/winston.config';
import { CreateMemberDto } from './dto/create-member.dto';
import { LoginDto } from './dto/login.dto';
import { PhoneRegisterDto } from './dto/phone-register.dto';
import { PhoneValidationDto } from './dto/phone-validation.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { Member } from './entities/member.entity';
import { MembersService } from './members.service';
import { Request } from 'express';
import { covertingPasswordToBcrypt } from 'src/tools/CommonTools';
import { SmsService } from '../sms/sms.service';

const RegistrationLogger = WinstonModule.createLogger(registrationWinstonConfig);

@Crud({
  model: {
    type: Member,
  },
  dto: {
    create: CreateMemberDto,
    update: UpdateMemberDto,
  },
  query: {
    exclude: ['password'],
    alwaysPaginate: true,
    softDelete: true,
    join: {
      created_by: {
        eager: true,
        allow: ['id', 'username'],
      },
      updated_by: {
        eager: true,
        allow: ['id', 'username'],
      },
    },
  },
  routes: {
    only: ['getOneBase', 'updateOneBase', 'deleteOneBase'],
  },
})
@UseGuards(WebAuthGuard)
@Controller('web/members')
export class MembersWebController implements CrudController<Member> {
  private readonly logger = RegistrationLogger;

  constructor(
    public service: MembersService,
    private readonly smsService: SmsService,
  ) {}

  get base(): CrudController<Member> {
    return this;
  }

  @Patch(':id')
  @Override()
  async updateOne(
    @ParsedRequest() crudRequest: CrudRequest,
    @ParsedBody() dto: UpdateMemberDto,
    @Param('id') id: number,
  ) {
    try {
      // coverting the password to sha1
      if (dto.password) {
        dto.password = covertingPasswordToBcrypt(dto.password);
      }

      return this.base.updateOneBase(crudRequest, dto);
    } catch (error) {
      console.error('Update user error:', error);
      throw error;
    }
  }

  @Public()
  @Post('login')
  async login(@Body() body: LoginDto) {
    try {
      return await this.service.login(body.account, body.password);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  @Public()
  @Post('register')
  async register(@Body() dto: CreateMemberDto, @Req() request: Request) {
    const ip =
      (request.headers['x-forwarded-for'] as string)?.split(',')[0].trim() ??
      request.socket?.remoteAddress;
    const userAgent = request.headers['user-agent'] ?? 'unknown';

    this.logger.log(`Register attempt | email=${dto.email} | ip=${ip} | ua=${userAgent}`);

    try {
      this.service.checkEmailDomain(dto.email);

      await this.service.checkEmailMxRecord(dto.email);

      await this.service.checkEmailExist({ email: dto.email });

      await this.service.registerMember({
        avatar_id: dto.avatar_id,
        name: dto.name,
        email: dto.email,
        phone: '',
        gender: dto.gender,
        age: dto.age,
        password: dto.password,
        isEmailValidated: false,
        isPhoneValidated: false,
        isBlocked: false,
      });

      // login
      return this.service.login(dto.email, dto.password);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  @Get('me')
  async getMe(@Req() request: Request) {
    try {
      const requestMember = request.member;

      if (!requestMember) {
        throw new BadRequestException('error.member.not_found');
      }

      const member = await this.service.findOne({
        where: { id: requestMember.id },
      });

      if (!member) {
        throw new BadRequestException('error.member.not_found');
      }

      return {
        id: member.id,
        name: member.name,
        email: member.email,
        phone: member.phone,
        avatar_id: member.avatar_id,
        is_email_verified: member.is_email_verified,
        is_sms_verified: member.is_sms_verified,
      };
    } catch (error) {
      console.error('Get me error:', error);
      throw error;
    }
  }

  @Get('sms-verification-status')
  async getSmsVerificationStatus(@Req() request: Request) {
    try {
      const requestMember = request.member;

      if (!requestMember) {
        throw new BadRequestException('error.member.not_found');
      }

      const member = await this.service.findOne({
        where: { id: requestMember.id },
      });

      if (!member) {
        throw new BadRequestException('error.member.not_found');
      }

      return {
        is_sms_verified: member.is_sms_verified,
      };
    } catch (error) {
      console.error('Get SMS verification status error:', error);
      throw error;
    }
  }

  @Post('email/verification-code/send')
  async sendEmailVerificationCode(
    @Req() request: Request,
    @Headers('accept-language') language: string,
  ) {
    try {
      const requestMember = request.member;

      if (!requestMember) {
        throw new BadRequestException('error.member.not_found');
      }

      const member = await this.service.findOne({
        where: { id: requestMember.id },
      });

      if (!member) {
        throw new BadRequestException('error.member.not_found');
      }

      if (member.is_email_verified) {
        throw new BadRequestException('error.email_already_verified');
      }

      await this.service.canSendVerificationCode('email_verification', member.email);

      const verificationCodeRecord = await this.service.generateVerificationCode(
        'email_verification',
        member.email,
      );

      await this.service.sendVerificationEmail(member.name, member.email, verificationCodeRecord.code, language);

      return true;
    } catch (error) {
      console.error('Send email verification code error:', error);
      throw error;
    }
  }

  @Post('register/email/verify')
  async registerEmailVerify(@Body('code') code: string, @Req() request: Request) {
    try {
      const requestMember = request.member;

      if (!requestMember) {
        throw new BadRequestException('error.member.not_found');
      }

      const member = await this.service.findOne({
        where: { id: requestMember.id },
      });

      if (!member) {
        throw new BadRequestException('error.member.not_found');
      }

      if (member.is_email_verified) {
        throw new BadRequestException('error.email_already_verified');
      }

      const isValid = await this.service.verifyCode(member.email, code, 'email_verification');

      if (!isValid) {
        throw new BadRequestException('error.email_verification.code_mismatch');
      }

      await this.service.updateMemberEmailValidated(member.email, true);

      return true;
    } catch (error) {
      console.error('Register email verify error:', error);
      throw error;
    }
  }

  @Post('phone/verification-code/send')
  async sendPhoneVerificationCode(
    @ParsedRequest() crudRequest: CrudRequest,
    @Body() dto: PhoneRegisterDto,
    @Req() request: Request,
    @Headers('accept-language') language: string,
  ) {
    try {
      const captchaToken = dto.captcha_token;

      const isValidCaptcha = await this.service.verifyCaptchaToken(captchaToken);

      if (!isValidCaptcha) {
        throw new BadRequestException('error.phone_verification.captcha_invalid');
      }

      // get member from request
      const requestMember = request.member;

      if (!requestMember) {
        throw new BadRequestException('error.member.not_found');
      }

      const member = await this.service.findOne({
        where: { id: requestMember.id },
      });

      if (!member) {
        throw new BadRequestException('error.member.not_found');
      }

      // check if phone is already used by other members
      await this.service.checkPhoneExist({ phone: dto.phone, id: member.id });

      await this.service.canSendVerificationCode('phone_verification', dto.phone);

      const verificationCodeRecord = await this.service.generateVerificationCode(
        'phone_verification',
        dto.phone,
      );

      // send verification code via SMS
      await this.smsService.sendOtpSms(dto.phone, verificationCodeRecord.code, language);

      return true;
    } catch (error) {
      console.error('Register phone send error:', error);
      throw error;
    }
  }

  @Post('register/phone/verify')
  async registerPhoneVerify(@Body() dto: PhoneValidationDto, @Req() request: Request) {
    try {
      const requestMember = request.member;

      if (!requestMember) {
        throw new BadRequestException('error.member.not_found');
      }

      const member = await this.service.findOne({
        where: { id: requestMember.id },
      });

      if (!member) {
        throw new BadRequestException('error.member.not_found');
      }

      if (member.is_sms_verified) {
        throw new BadRequestException('error.phone_already_verified');
      }

      // verify code
      const isValid = await this.service.verifyCode(dto.phone, dto.code, 'phone_verification');

      if (!isValid) {
        throw new BadRequestException('error.phone_verification.code_mismatch');
      }

      // update member email_validated to true
      await this.service.updateMemberPhoneValidated(member.id, dto.phone, true);

      return true;
    } catch (error) {
      console.error('Register phone verify error:', error);
      throw error;
    }
  }

  @Public()
  @Post('forgot-password/send')
  async sendForgotPasswordEmail(
    @Body('email') email: string,
    @Headers('accept-language') language: string,
  ) {
    try {
      if (!email) {
        throw new BadRequestException('error.member.email_required');
      }

      const member = await this.service.findOne({
        where: { email: email },
      });

      if (!member) {
        throw new BadRequestException('error.member.not_found');
      }

      await this.service.sendForgotPasswordEmail(member, language);
    } catch (error) {
      console.error('Send forgot password email error:', error);
      throw error;
    }
  }

  @Public()
  @Post('forgot-password/change-password')
  async verifyForgotPasswordToken(
    @Body('token') token: string,
    @Body('new_password') newPassword: string,
  ) {
    try {
      if (!token || !newPassword) {
        throw new BadRequestException('error.missing_parameters');
      }

      await this.service.changePasswordWithToken(token, newPassword);

      return true;
    } catch (error) {
      console.error('Verify forgot password token error:', error);
      throw error;
    }
  }
}
