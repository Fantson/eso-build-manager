import { Module } from '@nestjs/common';
import { BuildsService } from './builds.service';
import { BuildsController } from './builds.controller';
import { PrismaService } from '../prisma.service'; // Ważne: importujemy bazę danych

@Module({
  controllers: [BuildsController],
  providers: [BuildsService, PrismaService], // Rejestrujemy serwis i Prismę
})
export class BuildsModule {}