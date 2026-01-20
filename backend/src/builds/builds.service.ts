import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBuildDto } from './dto/create-build.dto';
import { UpdateBuildDto } from './dto/update-build.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class BuildsService {
  constructor(private prisma: PrismaService) {}

  create(createBuildDto: CreateBuildDto) {
    return this.prisma.build.create({
      data: {
        title: createBuildDto.title,
        class: createBuildDto.class,
        role: createBuildDto.role,
      },
    });
  }

  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.build.findMany({
        skip: skip,
        take: limit,
        include: { items: true },
        orderBy: { id: 'desc' },
      }),
      this.prisma.build.count(),
    ]);

    return {
      data,
      total,
      page,
      limit,
      lastPage: Math.ceil(total / limit),
    };
  }

  async findOne(id: number) {
    const build = await this.prisma.build.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!build) {
      throw new NotFoundException(`Build o ID ${id} nie został znaleziony`);
    }

    return build;
  }

  update(id: number, updateBuildDto: UpdateBuildDto) {
    return this.prisma.build.update({
      where: { id },
      data: updateBuildDto,
    });
  }

  remove(id: number) {
    return this.prisma.build.delete({
      where: { id },
    });
  }
}