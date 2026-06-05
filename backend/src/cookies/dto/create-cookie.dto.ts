import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsInt, IsPositive } from 'class-validator';

export class CreateCookieDto {
  @ApiProperty({ example: 'Chocolate Chip' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 'chocolate' })
  @IsString()
  @IsNotEmpty()
  flavor!: string;

  @ApiProperty({ example: 12 })
  @IsInt()
  @IsPositive()
  quantity!: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  @IsPositive()
  cookieJarId!: number;
}