import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Włączamy walidację danych (to sprawi, że DTO będą działać!)
  app.useGlobalPipes(new ValidationPipe());

  // 2. Włączamy CORS (żeby Frontend mógł się łączyć bez błędów)
  app.enableCors();

  // 3. Konfiguracja Swaggera (Dokumentacji)
  const config = new DocumentBuilder()
    .setTitle('ESO Build Manager API')
    .setDescription('Dokumentacja API do zarządzania buildami')
    .setVersion('1.0')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  
  // Tutaj mówimy: "Uruchom dokumentację pod adresem /api"
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();