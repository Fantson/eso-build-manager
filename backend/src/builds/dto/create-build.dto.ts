import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateBuildDto {
  @ApiProperty({ example: 'Magicka Templar Beam', description: 'Nazwa buildu' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Templar', description: 'Klasa postaci' })
  @IsString()
  @IsNotEmpty()
  class: string;

  @ApiProperty({ example: 'DPS', description: 'Rola w drużynie' })
  @IsString()
  @IsNotEmpty()
  role: string;
}