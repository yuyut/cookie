import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { Role } from '../users/user.entity';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;

  const usersService = { findByEmail: jest.fn(), create: jest.fn() };
  const jwtService = { sign: jest.fn() };

  const user = {
    id: 1,
    email: 'test@test.com',
    password: 'hashed',
    role: Role.USER,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('returns user info when registration succeeds', async () => {
      usersService.findByEmail.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed');
      usersService.create.mockResolvedValue(user);

      const result = await service.register('test@test.com', 'pass123');

      expect(result).toEqual({ id: 1, email: 'test@test.com', role: Role.USER });
      expect(usersService.create).toHaveBeenCalledWith('test@test.com', 'hashed');
    });

    it('throws ConflictException if email is taken', async () => {
      usersService.findByEmail.mockResolvedValue(user);

      await expect(service.register('test@test.com', 'pass123')).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('returns access_token on valid credentials', async () => {
      usersService.findByEmail.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      jwtService.sign.mockReturnValue('token123');

      const result = await service.login('test@test.com', 'pass123');

      expect(result).toEqual({ access_token: 'token123' });
    });

    it('throws UnauthorizedException when user does not exist', async () => {
      usersService.findByEmail.mockResolvedValue(null);

      await expect(service.login('nope@test.com', 'pass123')).rejects.toThrow(UnauthorizedException);
    });

    it('throws UnauthorizedException when password is wrong', async () => {
      usersService.findByEmail.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.login('test@test.com', 'wrongpass')).rejects.toThrow(UnauthorizedException);
    });
  });
});
