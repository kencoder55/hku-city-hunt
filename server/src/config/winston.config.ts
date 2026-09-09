import { utilities as nestWinstonModuleUtilities, WinstonModuleOptions } from 'nest-winston';
import * as winston from 'winston';
import 'winston-daily-rotate-file'; // must import this to use DailyRotateFile transport

const { combine, timestamp, printf, colorize, align } = winston.format;

export const winstonConfig: WinstonModuleOptions = {
  // logging level
  level: 'info',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    align(),
    // custom format for NestJS logger
    printf(({ level, message, timestamp, context }) => {
      // context is optional, it can be used to add additional context to the log message
      return `${timestamp} [${level.toUpperCase()}] ${context ? `[${context}] ` : ''}${message}`;
    }),
  ),
  transports: [
    // console output (all levels)
    new winston.transports.Console({
      format: combine(
        colorize({ all: true }), // console logging with colors
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        nestWinstonModuleUtilities.format.nestLike('MyApp', { prettyPrint: true }), // default NestJS format
      ),
    }),

    // file output (info and above)
    new winston.transports.DailyRotateFile({
      filename: 'logs/application-%DATE%.log', // file name pattern
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true, // zip old log files
      maxSize: '20m', // single file max size
      maxFiles: '14d', // keep logs for 14 days
      level: 'info', // log level for file transport
      format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        printf(({ level, message, timestamp, context }) => {
          return `${timestamp} [${level.toUpperCase()}] ${context ? `[${context}] ` : ''}${message}`;
        }),
      ),
    }),

    // error file output (error level only)
    new winston.transports.DailyRotateFile({
      filename: 'logs/error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '30d',
      level: 'error', // only log errors to this file
      format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        printf(({ level, message, timestamp, context }) => {
          return `${timestamp} [${level.toUpperCase()}] ${context ? `[${context}] ` : ''}${message}`;
        }),
      ),
    }),
  ],
};

export const smsWinstonConfig: WinstonModuleOptions = {
  ...winstonConfig,
  transports: [
    winstonConfig.transports[0], // console transport
    new winston.transports.DailyRotateFile({
      filename: 'logs/sms-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      level: 'info',
      format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        printf(({ level, message, timestamp, context }) => {
          return `${timestamp} [${level.toUpperCase()}] ${context ? `[${context}] ` : ''}${message}`;
        }),
      ),
    }),
    new winston.transports.DailyRotateFile({
      filename: 'logs/sms-error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '30d',
      level: 'error',
      format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        printf(({ level, message, timestamp, context }) => {
          return `${timestamp} [${level.toUpperCase()}] ${context ? `[${context}] ` : ''}${message}`;
        }),
      ),
    }),
  ],
};

export const rewardsWinstonConfig: WinstonModuleOptions = {
  ...winstonConfig,
  transports: [
    winstonConfig.transports[0], // console transport
    new winston.transports.DailyRotateFile({
      filename: 'logs/rewards-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      level: 'info',
      format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        printf(({ level, message, timestamp, context }) => {
          return `${timestamp} [${level.toUpperCase()}] ${context ? `[${context}] ` : ''}${message}`;
        }),
      ),
    }),
    new winston.transports.DailyRotateFile({
      filename: 'logs/rewards-error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '60d',
      level: 'error',
      format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        printf(({ level, message, timestamp, context }) => {
          return `${timestamp} [${level.toUpperCase()}] ${context ? `[${context}] ` : ''}${message}`;
        }),
      ),
    }),
  ],
};

export const registrationWinstonConfig: WinstonModuleOptions = {
  ...winstonConfig,
  transports: [
    winstonConfig.transports[0], // console transport
    new winston.transports.DailyRotateFile({
      filename: 'logs/registration-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '30d',
      level: 'info',
      format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        printf(({ level, message, timestamp, context }) => {
          return `${timestamp} [${level.toUpperCase()}] ${context ? `[${context}] ` : ''}${message}`;
        }),
      ),
    }),
    new winston.transports.DailyRotateFile({
      filename: 'logs/registration-error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '30d',
      level: 'error',
      format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        printf(({ level, message, timestamp, context }) => {
          return `${timestamp} [${level.toUpperCase()}] ${context ? `[${context}] ` : ''}${message}`;
        }),
      ),
    }),
  ],
};

export const letterWinstonConfig: WinstonModuleOptions = {
  ...winstonConfig,
  transports: [
    winstonConfig.transports[0], // console transport
    new winston.transports.DailyRotateFile({
      filename: 'logs/letter-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      level: 'info',
      format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        printf(({ level, message, timestamp, context }) => {
          return `${timestamp} [${level.toUpperCase()}] ${context ? `[${context}] ` : ''}${message}`;
        }),
      ),
    }),
    new winston.transports.DailyRotateFile({
      filename: 'logs/letter-error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '30d',
      level: 'error',
      format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        printf(({ level, message, timestamp, context }) => {
          return `${timestamp} [${level.toUpperCase()}] ${context ? `[${context}] ` : ''}${message}`;
        }),
      ),
    }),
  ],
};
