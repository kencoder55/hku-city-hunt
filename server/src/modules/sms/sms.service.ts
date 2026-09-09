import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);
  private readonly smsServerUrl = process.env.SMS_SERVER_URL;
  private readonly smsServerToken = process.env.SMS_SERVER_TOKEN;

  constructor(private readonly httpService: HttpService) {}

  async sendOtpSms(phoneNumber: string, otpCode: string, language: string): Promise<void> {
    try {
      await this.httpService.axiosRef.post(
        `${this.smsServerUrl}/api/sms/send-otp`,
        { phoneNumber, otpCode, language },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.smsServerToken}`,
          },
          timeout: 10000,
        },
      );
      this.logger.log(`OTP SMS sent successfully to ${phoneNumber}`);
    } catch (error) {
      this.logger.error(
        `Error sending OTP SMS to ${phoneNumber}: ${error?.message || JSON.stringify(error)}`,
      );
      throw new Error('error.phone_verification.sending_sms_failed');
    }
  }
}
