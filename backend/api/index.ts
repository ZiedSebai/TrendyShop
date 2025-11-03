import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from '../src/app.module';
import { ValidationPipe } from '@nestjs/common';
import express, { Request, Response } from 'express';

let cachedApp: express.Express;

async function createApp(): Promise<express.Express> {
  if (cachedApp) {
    return cachedApp;
  }

  const expressApp = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));

  const allowedOrigins = [
    process.env.FRONT_BASE_URL,
    'https://trendy-shop-lu5s.vercel.app',
    'http://localhost:5173',
  ].filter(Boolean);

  app.enableCors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  
  await app.init();
  cachedApp = expressApp;
  return expressApp;
}

export default async function handler(req: Request, res: Response) {
  const app = await createApp();
  app(req, res);
}
