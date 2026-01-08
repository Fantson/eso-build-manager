// backend/src/builds/builds.controller.ts
import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { BuildsService } from './builds.service';
import { CreateBuildDto } from './dto/create-build.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('builds')
@Controller('builds')
export class BuildsController { // <--- TO MUSI BYĆ "export class"
  constructor(private readonly buildsService: BuildsService) {}

  @Post()
  @ApiOperation({ summary: 'Stwórz nowy build' })
  create(@Body() createBuildDto: CreateBuildDto) {
    return this.buildsService.create(createBuildDto);
  }

  @Get()
  @ApiOperation({ summary: 'Pobierz wszystkie buildy' })
  findAll() {
    return this.buildsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.buildsService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.buildsService.remove(+id);
  }
}