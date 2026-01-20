import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
// Dodaj import filtra:
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  // Walidacja (już to masz)
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // --- NOWOŚĆ: Rejestracja Globalnego Filtra Błędów ---
  app.useGlobalFilters(new HttpExceptionFilter());
  // -----------------------------------------------------

  // Swagger (już to masz)
  const config = new DocumentBuilder()
    .setTitle('ESO Build Manager API')
    .setDescription('API do zarządzania buildami i przedmiotami w ESO')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(3000);
}
bootstrap();