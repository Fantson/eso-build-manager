import { IsString, IsNotEmpty, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBuildDto {
  @ApiProperty({ example: 'Magicka Templar Beam', description: 'Nazwa buildu' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Templar', description: 'Klasa postaci' })
  @IsString()
  @IsNotEmpty()
  class: string;

  @ApiProperty({ example: 'DPS', description: 'Rola w grupie', enum: ['Tank', 'Healer', 'DPS', 'PVP'] })
  @IsString()
  @IsNotEmpty()
  @IsIn(['Tank', 'Healer', 'DPS', 'PVP']) // Walidacja: tylko te wartości są dozwolone
  role: string;
}