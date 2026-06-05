import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsInt, IsPositive, IsOptional } from 'class-validator';

export class UpdateCookieDto {
  @ApiPropertyOptional({ example: 'Chocolate Chip' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ example: 'chocolate' })
  @IsString()
  @IsOptional()
  flavor?: string;

  @ApiPropertyOptional({ example: 12 })
  @IsInt()
  @IsPositive()
  @IsOptional()
  quantity?: number;

  @ApiPropertyOptional({ example: 1 })
  @IsInt()
  @IsPositive()
  @IsOptional()
  cookieJarId?: number;
}