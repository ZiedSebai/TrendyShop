import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      process.env.FRONT_BASE_URL,
      'https://trendy-shop-lu5s.vercel.app',
      'http://localhost:5173'
    ].filter(Boolean),
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  await app.listen(process.env.PORT || 3000);
  console.log(`✅ Server running on port ${process.env.PORT || 3000}`);
}
bootstrap();
