import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cookie } from './cookie.entity';
import { CreateCookieDto } from './dto/create-cookie.dto';
import { UpdateCookieDto } from './dto/update-cookie.dto';

@Injectable()
export class CookiesService {
  constructor(
    @InjectRepository(Cookie)
    private readonly repo: Repository<Cookie>,
  ) {}

  findAll(): Promise<Cookie[]> {
    return this.repo.find({ relations: { cookieJar: true } });
  }

  async findOne(id: number): Promise<Cookie> {
    const cookie = await this.repo.findOne({ where: { id }, relations: { cookieJar: true } });
    if (!cookie) throw new NotFoundException(`Cookie #${id} not found`);
    return cookie;
  }

  async create(dto: CreateCookieDto): Promise<Cookie> {
    const cookie = this.repo.create(dto);
    try {
      return await this.repo.save(cookie);
    } catch (e: any) {
      if (e?.message?.includes('FOREIGN KEY')) {
        throw new BadRequestException(`Cookie jar #${dto.cookieJarId} does not exist.`);
      }
      throw e;
    }
  }

  async update(id: number, dto: UpdateCookieDto): Promise<Cookie> {
    const cookie = await this.findOne(id);
    Object.assign(cookie, dto);
    return this.repo.save(cookie);
  }

  async remove(id: number): Promise<void> {
    const cookie = await this.findOne(id);
    await this.repo.remove(cookie);
  }
}