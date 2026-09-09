import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import * as fs from 'fs';
import { WinstonModule } from 'nest-winston';
import * as path from 'path';
import { letterWinstonConfig } from 'src/config/winston.config';
import { MissionRecordsService } from '../mission-records/mission-records.service';

const LetterWinstonLogger = WinstonModule.createLogger(letterWinstonConfig);

@Injectable()
export class TasksService {
  private readonly logger = LetterWinstonLogger;

  constructor(
    private readonly missionRecordsService: MissionRecordsService,
    private readonly mailerService: MailerService,
  ) {}

  // Runs at 09:00 HKT (01:00 UTC) every day
  @Cron('0 1 * * *')
  async sendLetterAnniversaryEmails(): Promise<void> {
    this.logger.log('Running letter anniversary email cron job');

    let records = [];
    try {
      records = await this.missionRecordsService.findLetterRecordsCreatedOneYearAgo();
    } catch (error) {
      this.logger.error('Failed to fetch letter anniversary records', error);
      return;
    }

    if (records.length === 0) {
      this.logger.log('No letter anniversary records found for today');
      return;
    }

    const templatePath = path.join(__dirname, '../../templates/email/letter-anniversary.html');
    const htmlTemplate = fs.readFileSync(templatePath, 'utf-8');

    let sent = 0;
    for (const record of records) {
      const member = record.member;
      if (!member?.email) continue;

      const result = record.result as any;
      const letterText = result?.text ?? '';

      const html = htmlTemplate
        .replace(/{{MEMBER_NAME}}/g, member.name || '')
        .replace(/{{LETTER_TEXT}}/g, letterText);

      try {
        await this.mailerService.sendMail({
          to: member.email,
          subject: '你一年前給自己的信 | Your Letter from a Year Ago – 330 Day 2026',
          html,
        });
        sent++;
      } catch (error) {
        this.logger.error(`Failed to send letter anniversary email to member ${member.id}`, error);
      }
    }

    this.logger.log(`Letter anniversary emails sent: ${sent}/${records.length}`);
  }
}
