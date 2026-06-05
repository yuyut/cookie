import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpdateCookieJarDto {
  @ApiPropertyOptional({ example: 'My Cookie Jar' })
  @IsString()
  @IsOptional()
  name?: string;
}