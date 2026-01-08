import { Injectable } from '@nestjs/common';
import { CreateBuildDto } from './dto/create-build.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class BuildsService {
  // Wstrzykujemy bazę danych (Prisma)
  constructor(private prisma: PrismaService) {}

  // Tworzenie builda
  create(createBuildDto: CreateBuildDto) {
    return this.prisma.build.create({
      data: {
        title: createBuildDto.title,
        class: createBuildDto.class,
        role: createBuildDto.role,
        // Na razie bez items, żeby było prościej na start
      },
    });
  }

  // Pobieranie wszystkich buildów
  findAll() {
    return this.prisma.build.findMany({
      include: { items: true }, // Pobierz od razu z przedmiotami
    });
  }

  findOne(id: number) {
    return this.prisma.build.findUnique({ where: { id } });
  }

  remove(id: number) {
    return this.prisma.build.delete({ where: { id } });
  }
}