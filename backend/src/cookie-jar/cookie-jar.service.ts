import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CookieJar } from './cookie-jar.entity';
import { CreateCookieJarDto } from './dto/create-cookie-jar.dto';
import { UpdateCookieJarDto } from './dto/update-cookie-jar.dto';

@Injectable()
export class CookieJarService {
  constructor(
    @InjectRepository(CookieJar)
    private readonly repo: Repository<CookieJar>,
  ) {}

  findAll(): Promise<CookieJar[]> {
    return this.repo.find({ relations: { cookies: true } });
  }

  async findOne(id: number): Promise<CookieJar> {
    const jar = await this.repo.findOne({ where: { id }, relations: { cookies: true } });
    if (!jar) throw new NotFoundException(`CookieJar #${id} not found`);
    return jar;
  }

  create(dto: CreateCookieJarDto): Promise<CookieJar> {
    const jar = this.repo.create(dto);
    return this.repo.save(jar);
  }

  async update(id: number, dto: UpdateCookieJarDto): Promise<CookieJar> {
    const jar = await this.findOne(id);
    Object.assign(jar, dto);
    return this.repo.save(jar);
  }

  async remove(id: number): Promise<void> {
    const jar = await this.findOne(id);
    await this.repo.remove(jar);
  }
}