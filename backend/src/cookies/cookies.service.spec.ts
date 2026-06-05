import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CookiesService } from './cookies.service';
import { Cookie } from './cookie.entity';

describe('CookiesService', () => {
  let service: CookiesService;

  const repo = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  const cookie: Cookie = {
    id: 1,
    name: 'Chocolate Chip',
    flavor: 'chocolate',
    quantity: 10,
    cookieJarId: 1,
    cookieJar: null as any,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CookiesService,
        { provide: getRepositoryToken(Cookie), useValue: repo },
      ],
    }).compile();

    service = module.get<CookiesService>(CookiesService);
    jest.clearAllMocks();
  });

  it('findAll returns cookies with jar relation', async () => {
    repo.find.mockResolvedValue([cookie]);

    const result = await service.findAll();

    expect(repo.find).toHaveBeenCalledWith({ relations: { cookieJar: true } });
    expect(result).toEqual([cookie]);
  });

  it('findOne returns cookie when found', async () => {
    repo.findOne.mockResolvedValue(cookie);

    const result = await service.findOne(1);

    expect(result).toEqual(cookie);
  });

  it('findOne throws NotFoundException when not found', async () => {
    repo.findOne.mockResolvedValue(null);

    await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
  });

  it('create saves and returns cookie', async () => {
    const dto = { name: 'Oreo', flavor: 'vanilla', quantity: 5, cookieJarId: 1 };
    repo.create.mockReturnValue(cookie);
    repo.save.mockResolvedValue(cookie);

    const result = await service.create(dto);

    expect(repo.create).toHaveBeenCalledWith(dto);
    expect(result).toEqual(cookie);
  });

  it('create throws BadRequestException on invalid cookieJarId', async () => {
    repo.create.mockReturnValue({});
    repo.save.mockRejectedValue(new Error('FOREIGN KEY constraint failed'));

    await expect(
      service.create({ name: 'Oreo', flavor: 'vanilla', quantity: 5, cookieJarId: 999 }),
    ).rejects.toThrow(BadRequestException);
  });

  it('create rethrows unexpected errors', async () => {
    repo.create.mockReturnValue({});
    repo.save.mockRejectedValue(new Error('disk full'));

    await expect(
      service.create({ name: 'Oreo', flavor: 'vanilla', quantity: 5, cookieJarId: 1 }),
    ).rejects.toThrow('disk full');
  });

  it('update merges changes and saves', async () => {
    repo.findOne.mockResolvedValue({ ...cookie });
    repo.save.mockResolvedValue({ ...cookie, quantity: 20 });

    const result = await service.update(1, { quantity: 20 });

    expect(result.quantity).toBe(20);
  });

  it('update throws NotFoundException when cookie missing', async () => {
    repo.findOne.mockResolvedValue(null);

    await expect(service.update(99, { quantity: 5 })).rejects.toThrow(NotFoundException);
  });

  it('remove deletes the cookie', async () => {
    repo.findOne.mockResolvedValue(cookie);
    repo.remove.mockResolvedValue(undefined);

    await service.remove(1);

    expect(repo.remove).toHaveBeenCalledWith(cookie);
  });

  it('remove throws NotFoundException when cookie missing', async () => {
    repo.findOne.mockResolvedValue(null);

    await expect(service.remove(99)).rejects.toThrow(NotFoundException);
  });
});
