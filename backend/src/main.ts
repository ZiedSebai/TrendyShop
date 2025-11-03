import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import serverless from 'serverless-http';
import express from 'express';

const expressApp = express();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));

  app.enableCors({
    origin:
      process.env.NODE_ENV === 'production'
        ? 'https://trendy-shop-lu5s.vercel.app'
        : 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  await app.init();
}

bootstrap();

export const handler = serverless(expressApp);
