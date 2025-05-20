import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../services/users.service';
import { PrismaService } from '@/common/infraestructure/prisma/prisma.service';

describe('UsersService', () => {
  let service: UsersService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              create: jest.fn(),
              findUnique: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should create a user', async () => {
    const createDto = {
      phone: '+541123456789',
      name: 'Juan',
      surname: 'Pérez',
      email: 'juan.perez@example.com',
      password: 'StrongPassword123!',
    };

    const mockUser = {
      id: 'uuid-123',
      email: createDto.email,
      phone: createDto.phone,
      name: createDto.name,
      surname: createDto.surname,
      role: 'USER',
    };

    (prisma.user.create as jest.Mock).mockResolvedValue(mockUser);

    const result = await service.createUser(createDto);

    expect(result).toEqual(mockUser);
    expect(prisma.user.create).toHaveBeenCalledWith({
      data: {
        phone: createDto.phone,
        name: createDto.name,
        surname: createDto.surname,
        email: createDto.email,
        role: 'USER',
      },
    });
  });

  it('should find a user by phone', async () => {
    const mockUser = {
      id: 'uuid-123',
      phone: '1234567890',
      password: 'hashedpassword',
      name: 'Test',
      surname: 'User',
      email: null,
      role: 'USER',
    };
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

    const result = await service.findByEmail('');
    expect(result).toEqual(mockUser);
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { phone: 'juan.perez@example.com' },
    });
  });
});
