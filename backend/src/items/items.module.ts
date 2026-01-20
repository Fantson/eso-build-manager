import { Module } from '@nestjs/common';
import { ItemsService } from './items.service';
import { ItemsController } from './items.controller';
import { PrismaService } from '../prisma.service'; // <--- 1. Importujemy

@Module({
  controllers: [ItemsController],
  providers: [ItemsService, PrismaService], // <--- 2. Rejestrujemy tutaj!
})
export class ItemsModule {}