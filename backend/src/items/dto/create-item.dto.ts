import { IsString, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateItemDto {
  @ApiProperty({ example: 'Mother\'s Sorrow', description: 'Nazwa przedmiotu' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Chest', description: 'Slot ekwipunku' })
  @IsString()
  @IsNotEmpty()
  slot: string;

  @ApiProperty({ example: 'Divines', description: 'Cecha przedmiotu (Trait)' })
  @IsString()
  @IsNotEmpty()
  trait: string;

  @ApiProperty({ example: 1, description: 'ID Buildu do którego należy przedmiot' })
  @IsNumber()
  @IsNotEmpty()
  buildId: number;
}