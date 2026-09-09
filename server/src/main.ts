import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';
import { ValidationPipe } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from './config/winston.config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: WinstonModule.createLogger(winstonConfig),
  });
  const port = process.env.PORT || 8080;

  app.setGlobalPrefix('api');

  // setup swagger if not in production
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('API Docs')
      .setDescription('The cats API description')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);
  }

  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: "*",
    credentials: true,
  });

  app.set('query parser', 'extended');

  await app.listen(port);

  // Fix 502 errors behind AWS ALB:
  // ALB default idle timeout is 60s, but Node.js default keepAliveTimeout is 5s.
  // When ALB reuses a connection that Node.js already closed, it gets a 502.
  // Set keepAliveTimeout slightly above ALB's 60s idle timeout.
  const server = app.getHttpServer();
  server.keepAliveTimeout = 3_605_000; // 3605 seconds (ALB is 3600s, +5s buffer)
  server.headersTimeout = 3_606_000;   // must be > keepAliveTimeout

  console.log(`Server is running at http://localhost:${port}/`);
}
bootstrap();
