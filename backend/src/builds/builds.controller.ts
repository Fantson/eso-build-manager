import { Controller, Get, Post, Body, Param, Delete, Query } from '@nestjs/common';
import { BuildsService } from './builds.service';
import { CreateBuildDto } from './dto/create-build.dto';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger'; // Dodano ApiQuery

@ApiTags('builds')
@Controller('builds')
export class BuildsController {
  constructor(private readonly buildsService: BuildsService) {}

  @Post()
  @ApiOperation({ summary: 'Stwórz nowy build' })
  create(@Body() createBuildDto: CreateBuildDto) {
    return this.buildsService.create(createBuildDto);
  }

  // --- ZMODYFIKOWANA METODA FINDALL ---
  @Get()
  @ApiOperation({ summary: 'Pobierz buildy (z paginacją)' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Numer strony (domyślnie 1)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Ilość na stronę (domyślnie 10)' })
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    // Parametry z URL przychodzą jako stringi, musimy je zamienić na liczby
    const pageNumber = page ? parseInt(page, 10) : 1;
    const limitNumber = limit ? parseInt(limit, 10) : 10;

    return this.buildsService.findAll(pageNumber, limitNumber);
  }
  // ------------------------------------

  @Get(':id')
  @ApiOperation({ summary: 'Pobierz jeden build po ID' })
  findOne(@Param('id') id: string) {
    return this.buildsService.findOne(+id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Usuń build' })
  remove(@Param('id') id: string) {
    return this.buildsService.remove(+id);
  }
}