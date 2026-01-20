import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('items') // Nowa sekcja w Swaggerze
@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Post()
  @ApiOperation({ summary: 'Dodaj przedmiot do buildu' })
  create(@Body() createItemDto: CreateItemDto) {
    return this.itemsService.create(createItemDto);
  }

  @Get()
  @ApiOperation({ summary: 'Pobierz wszystkie przedmioty' })
  findAll() {
    return this.itemsService.findAll();
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Usuń przedmiot' })
  remove(@Param('id') id: string) {
    return this.itemsService.remove(+id);
  }
}