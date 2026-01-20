import { Injectable } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ItemsService {
  constructor(private prisma: PrismaService) {}

  // Dodawanie przedmiotu
  create(createItemDto: CreateItemDto) {
    return this.prisma.item.create({
      data: {
        name: createItemDto.name,
        slot: createItemDto.slot,
        trait: createItemDto.trait,
        buildId: createItemDto.buildId, // To łączy przedmiot z buildem!
      },
    });
  }

  // Pobieranie wszystkich przedmiotów (opcjonalnie)
  findAll() {
    return this.prisma.item.findMany();
  }

  // Usuwanie przedmiotu
  remove(id: number) {
    return this.prisma.item.delete({ where: { id } });
  }
}