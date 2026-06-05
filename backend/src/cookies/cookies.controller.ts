import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CookiesService } from './cookies.service';
import { CreateCookieDto } from './dto/create-cookie.dto';
import { UpdateCookieDto } from './dto/update-cookie.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Cookies')
@ApiBearerAuth()
@Controller('cookies')
@UseGuards(JwtAuthGuard)
export class CookiesController {
  constructor(private readonly service: CookiesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all cookies' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a cookie by id' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new cookie' })
  create(@Body() dto: CreateCookieDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a cookie' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCookieDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a cookie' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}