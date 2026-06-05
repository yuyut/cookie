import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CookieJarService } from './cookie-jar.service';
import { CookieJar } from './cookie-jar.entity';

describe('CookieJarService', () => {
  let service: CookieJarService;

  const repo = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  const jar: CookieJar = {
    id: 1,
    name: 'My Jar',
    cookies: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CookieJarService,
        { provide: getRepositoryToken(CookieJar), useValue: repo },
      ],
    }).compile();

    service = module.get<CookieJarService>(CookieJarService);
    jest.clearAllMocks();
  });

  it('findAll returns all jars with cookies', async () => {
    repo.find.mockResolvedValue([jar]);

    const result = await service.findAll();

    expect(repo.find).toHaveBeenCalledWith({ relations: { cookies: true } });
    expect(result).toEqual([jar]);
  });

  it('findOne returns jar by id', async () => {
    repo.findOne.mockResolvedValue(jar);

    const result = await service.findOne(1);

    expect(result).toEqual(jar);
  });

  it('findOne throws NotFoundException when jar not found', async () => {
    repo.findOne.mockResolvedValue(null);

    await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
  });

  it('create saves and returns new jar', async () => {
    repo.create.mockReturnValue(jar);
    repo.save.mockResolvedValue(jar);

    const result = await service.create({ name: 'My Jar' });

    expect(repo.create).toHaveBeenCalledWith({ name: 'My Jar' });
    expect(result).toEqual(jar);
  });

  it('update applies changes and saves', async () => {
    repo.findOne.mockResolvedValue({ ...jar });
    repo.save.mockResolvedValue({ ...jar, name: 'Renamed' });

    const result = await service.update(1, { name: 'Renamed' });

    expect(result.name).toBe('Renamed');
  });

  it('update throws NotFoundException when jar not found', async () => {
    repo.findOne.mockResolvedValue(null);

    await expect(service.update(99, { name: 'x' })).rejects.toThrow(NotFoundException);
  });

  it('remove deletes the jar', async () => {
    repo.findOne.mockResolvedValue(jar);

    await service.remove(1);

    expect(repo.remove).toHaveBeenCalledWith(jar);
  });

  it('remove throws NotFoundException when jar not found', async () => {
    repo.findOne.mockResolvedValue(null);

    await expect(service.remove(99)).rejects.toThrow(NotFoundException);
  });
});
