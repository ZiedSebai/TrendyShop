import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import express, { Request, Response } from 'express';
import cors from 'cors';

let cachedApp: express.Express;

async function createApp(): Promise<express.Express> {
  if (cachedApp) return cachedApp;

  const expressApp = express();
  const allowedOrigins = [
    process.env.FRONT_BASE_URL,
    'https://trendy-shop-lu5s.vercel.app',
    'http://localhost:5173'
  ].filter(Boolean);
  expressApp.use(
    cors({
      origin: allowedOrigins,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    })
  );

  const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));

  // Enable CORS
  

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });

  // Global validation
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // Add /health route directly in Express
  expressApp.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({ status: 'ok' });
  });

  await app.init();
  cachedApp = expressApp;
  return expressApp;
}

// Default export for Vercel serverless
export default async function handler(req: Request, res: Response) {
  const app = await createApp();
  app(req, res);
}
