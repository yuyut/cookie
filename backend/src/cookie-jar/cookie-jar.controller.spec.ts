import { Test, TestingModule } from '@nestjs/testing';
import { CookieJarController } from './cookie-jar.controller';
import { CookieJarService } from './cookie-jar.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

describe('CookieJarController', () => {
  let controller: CookieJarController;

  const cookieJarService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const jar = { id: 1, name: 'My Jar', cookies: [] };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CookieJarController],
      providers: [{ provide: CookieJarService, useValue: cookieJarService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<CookieJarController>(CookieJarController);
    jest.clearAllMocks();
  });

  it('findAll returns all jars', async () => {
    cookieJarService.findAll.mockResolvedValue([jar]);

    const result = await controller.findAll();

    expect(cookieJarService.findAll).toHaveBeenCalled();
    expect(result).toEqual([jar]);
  });

  it('findOne returns jar by id', async () => {
    cookieJarService.findOne.mockResolvedValue(jar);

    const result = await controller.findOne(1);

    expect(cookieJarService.findOne).toHaveBeenCalledWith(1);
    expect(result).toEqual(jar);
  });

  it('create passes dto to service', async () => {
    cookieJarService.create.mockResolvedValue(jar);

    await controller.create({ name: 'My Jar' });

    expect(cookieJarService.create).toHaveBeenCalledWith({ name: 'My Jar' });
  });

  it('update passes id and dto to service', async () => {
    const updated = { ...jar, name: 'Renamed' };
    cookieJarService.update.mockResolvedValue(updated);

    const result = await controller.update(1, { name: 'Renamed' });

    expect(cookieJarService.update).toHaveBeenCalledWith(1, { name: 'Renamed' });
    expect(result.name).toBe('Renamed');
  });

  it('remove calls service with id', async () => {
    cookieJarService.remove.mockResolvedValue(undefined);

    await controller.remove(1);

    expect(cookieJarService.remove).toHaveBeenCalledWith(1);
  });
});
