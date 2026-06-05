import { Test, TestingModule } from '@nestjs/testing';
import { CookiesController } from './cookies.controller';
import { CookiesService } from './cookies.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

describe('CookiesController', () => {
  let controller: CookiesController;

  const cookiesService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const cookie = { id: 1, name: 'Chocolate Chip', flavor: 'chocolate', quantity: 10, cookieJarId: 1 };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CookiesController],
      providers: [{ provide: CookiesService, useValue: cookiesService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<CookiesController>(CookiesController);
    jest.clearAllMocks();
  });

  it('findAll returns list of cookies', async () => {
    cookiesService.findAll.mockResolvedValue([cookie]);

    const result = await controller.findAll();

    expect(cookiesService.findAll).toHaveBeenCalled();
    expect(result).toEqual([cookie]);
  });

  it('findOne returns a single cookie by id', async () => {
    cookiesService.findOne.mockResolvedValue(cookie);

    const result = await controller.findOne(1);

    expect(cookiesService.findOne).toHaveBeenCalledWith(1);
    expect(result).toEqual(cookie);
  });

  it('create passes dto to service', async () => {
    const dto = { name: 'Oreo', flavor: 'vanilla', quantity: 5, cookieJarId: 1 };
    cookiesService.create.mockResolvedValue(cookie);

    await controller.create(dto);

    expect(cookiesService.create).toHaveBeenCalledWith(dto);
  });

  it('update passes id and dto to service', async () => {
    const dto = { quantity: 20 };
    cookiesService.update.mockResolvedValue({ ...cookie, quantity: 20 });

    const result = await controller.update(1, dto);

    expect(cookiesService.update).toHaveBeenCalledWith(1, dto);
    expect(result.quantity).toBe(20);
  });

  it('remove calls service with id', async () => {
    cookiesService.remove.mockResolvedValue(undefined);

    await controller.remove(1);

    expect(cookiesService.remove).toHaveBeenCalledWith(1);
  });
});
