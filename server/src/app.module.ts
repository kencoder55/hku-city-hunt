import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import typeorm from './config/typeorm';
import { GlobalExceptionFilter } from './filter/GlobalExceptionFilter';
import { NotFoundExceptionFilter } from './filter/NotFoundExceptionFilter';
import { GlobalResponseInterceptor } from './interceptor/GlobalResponseInterceptor';
import { MembersModule } from './modules/members/members.module';
import { PermissionModuleModules } from './modules/permission-modules/permission-modules.module';
import { PermissionModules } from './modules/permissions/permissions.module';
import { RolesModule } from './modules/roles/roles.module';
import { MemberSessionsModule } from './modules/sessions/member-sessions/member-sessions.module';
import { UserSessionsModule } from './modules/sessions/user-sessions/user-sessions.module';
import { UsersModule } from './modules/users/users.module';
import { VerificationCodesModule } from './modules/verification-codes/verification-codes.module';
import { MemberWellbeingModule } from './modules/member-wellbeing/member-wellbeing.module';
import { MissionsModule } from './modules/missions/missions.module';
import { MissionRecordsModule } from './modules/mission-records/mission-records.module';
import { MembersResetPasswordTokensModule } from './modules/members-reset-password-tokens/members-reset-password-tokens.module';
import { MemberRewardsModule } from './modules/member-rewards/member-rewards.module';
import { ProductsModule } from './modules/products/products.module';
import { SmsModule } from './modules/sms/sms.module';
import { RedemptionCodesModule } from './modules/redemption-codes/redemption-codes.module';
import { RedemptionRecordsModule } from './modules/redemption-records/redemption-records.module';
import { RewardsModule } from './modules/rewards/rewards.module';
import { S3Module } from './modules/s3/s3.module';
import { TasksModule } from './modules/tasks/tasks.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeorm],
    }),
    ScheduleModule.forRoot(),
    JwtModule.register({
      global: true,
      secret: process.env.TOKEN_SECRET,
      signOptions: { expiresIn: '30d' },
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => configService.get('typeorm'),
    }),
    ServeStaticModule.forRoot({
      serveRoot: '/uploads',
      rootPath: join(__dirname, '..', 'uploads'),
      exclude: ['/api/{*path}'],
      serveStaticOptions: { index: false },
    }),
    MailerModule.forRoot({
      transport: {
        host: process.env.SENDGRID_HOST,
        port: parseInt(process.env.SENDGRID_PORT) || 587,
        auth: {
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_PASSWORD,
        },
      },
      defaults: {
        from: process.env.SENDGRID_FROM || '<no-reply@mosaicdigi.com>',
      },
    }),
    UsersModule,
    PermissionModules,
    PermissionModuleModules,
    RolesModule,
    MembersModule,
    UserSessionsModule,
    MemberSessionsModule,
    VerificationCodesModule,
    MemberWellbeingModule,
    MissionsModule,
    MissionRecordsModule,
    MembersResetPasswordTokensModule,
    MemberRewardsModule,
    ProductsModule,
    SmsModule,
    RedemptionCodesModule,
    RedemptionRecordsModule,
    RewardsModule,
    S3Module,
    TasksModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_INTERCEPTOR, useClass: GlobalResponseInterceptor },
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: NotFoundExceptionFilter,
    },
  ],
})
export class AppModule {}
