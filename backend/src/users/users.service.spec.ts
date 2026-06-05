import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User, Role } from './user.entity';

describe('UsersService', () => {
  let service: UsersService;

  const repo = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const user: User = {
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
        UsersService,
        { provide: getRepositoryToken(User), useValue: repo },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    jest.clearAllMocks();
  });

  it('findByEmail returns user when found', async () => {
    repo.findOne.mockResolvedValue(user);

    const result = await service.findByEmail('test@test.com');

    expect(repo.findOne).toHaveBeenCalledWith({ where: { email: 'test@test.com' } });
    expect(result).toEqual(user);
  });

  it('findByEmail returns null when not found', async () => {
    repo.findOne.mockResolvedValue(null);

    const result = await service.findByEmail('nobody@test.com');

    expect(result).toBeNull();
  });

  it('create saves and returns new user', async () => {
    repo.create.mockReturnValue(user);
    repo.save.mockResolvedValue(user);

    const result = await service.create('test@test.com', 'hashed');

    expect(repo.create).toHaveBeenCalledWith({ email: 'test@test.com', password: 'hashed', role: undefined });
    expect(result).toEqual(user);
  });

  it('create accepts optional role', async () => {
    const admin = { ...user, role: Role.ADMIN };
    repo.create.mockReturnValue(admin);
    repo.save.mockResolvedValue(admin);

    const result = await service.create('admin@test.com', 'hashed', Role.ADMIN);

    expect(result.role).toBe(Role.ADMIN);
  });
});
