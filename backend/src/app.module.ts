// backend/src/app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { BuildsModule } from './builds/builds.module'; 
import { ItemsModule } from './items/items.module';

@Module({
  imports: [BuildsModule, ItemsModule], // <--- Tutaj musi być BuildsModule!
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}