import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CookieJarService } from './cookie-jar.service';
import { CreateCookieJarDto } from './dto/create-cookie-jar.dto';
import { UpdateCookieJarDto } from './dto/update-cookie-jar.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../users/user.entity';

@ApiTags('Cookie Jar')
@ApiBearerAuth()
@Controller('cookie-jar')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class CookieJarController {
  constructor(private readonly service: CookieJarService) {}

  @Get()
  @ApiOperation({ summary: 'Get all cookie jars (admin only)' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a cookie jar by id (admin only)' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new cookie jar (admin only)' })
  create(@Body() dto: CreateCookieJarDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a cookie jar (admin only)' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCookieJarDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a cookie jar (admin only)' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}