import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Role } from '../users/user.entity';

describe('AuthController', () => {
  let controller: AuthController;

  const authService = { register: jest.fn(), login: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: authService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    jest.clearAllMocks();
  });

  it('register calls service with email and password', async () => {
    authService.register.mockResolvedValue({ id: 1, email: 'a@b.com', role: Role.USER });

    const result = await controller.register({ email: 'a@b.com', password: 'pass' });

    expect(authService.register).toHaveBeenCalledWith('a@b.com', 'pass');
    expect(result).toHaveProperty('id', 1);
  });

  it('login calls service and returns token', async () => {
    authService.login.mockResolvedValue({ access_token: 'tok' });

    const result = await controller.login({ email: 'a@b.com', password: 'pass' });

    expect(authService.login).toHaveBeenCalledWith('a@b.com', 'pass');
    expect(result).toEqual({ access_token: 'tok' });
  });
});
