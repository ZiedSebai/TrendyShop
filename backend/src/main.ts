import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import express, { Request, Response } from 'express';

let cachedApp: express.Express;

async function createApp(): Promise<express.Express> {
  if (cachedApp) return cachedApp;

  const expressApp = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));

  // Enable CORS
  const allowedOrigins = [
    process.env.FRONT_BASE_URL,
    'https://trendy-shop-lu5s.vercel.app',
    'http://localhost:5173'
  ].filter(Boolean);

  app.enableCors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // Handle preflight for serverless
  expressApp.options('*', (_req, res) => res.sendStatus(200));

  // Global validation
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // Health endpoint
  expressApp.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({ status: 'ok' });
  });

  await app.init();
  cachedApp = expressApp;
  return expressApp;
}

// Vercel handler
export default async function handler(req: Request, res: Response) {
  const app = await createApp();
  app(req, res);
}
