import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateCookieJarDto {
  @ApiProperty({ example: 'My Cookie Jar' })
  @IsString()
  @IsNotEmpty()
  name!: string;
}