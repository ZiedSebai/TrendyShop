import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';

export async function createApp() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [process.env.FRONT_BASE_URL, 'https://trendy-shop-lu5s.vercel.app', 'http://localhost:5173'].filter(Boolean),
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  app.getHttpAdapter().get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  return app;
}

// Run only when not imported (for local dev)
if (require.main === module) {
  createApp().then(app => app.listen(3000));
}
