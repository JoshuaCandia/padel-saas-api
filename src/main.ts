import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { PrismaExceptionFilter } from './common/filters/prisma-exception.filter';
import { LogInterceptor } from './common/interceptors/log.interceptor';

const PORT = 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new PrismaExceptionFilter());
  app.useGlobalInterceptors(new LogInterceptor());

  await app.listen(3000);
  console.log(`App listening port ${PORT}`);
}
bootstrap();
