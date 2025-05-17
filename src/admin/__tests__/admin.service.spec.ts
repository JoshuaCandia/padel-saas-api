import { Test, TestingModule } from '@nestjs/testing';
import { AdminService } from '@/admin/admin.service';
import { PrismaService } from '@/prisma/prisma.service';
import { ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  ...jest.requireActual('bcrypt'),
  hash: jest.fn(),
}));

const prismaMock = {
  user: {
    findUnique: jest.fn() as jest.Mock<Promise<any>, [any]>,
    create: jest.fn() as jest.Mock<Promise<any>, [any]>,
  },
};

describe('AdminService', () => {
  let service: AdminService;

  beforeEach(async () => {
    jest.clearAllMocks();

    (bcrypt.hash as jest.Mock).mockResolvedValue('hashedpassword');

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<AdminService>(AdminService);
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('should create an admin successfully', async () => {
    // Arrange
    const dto = {
      email: 'admin@test.com',
      password: 'password123',
      name: 'Admin',
      surname: 'Test',
      phone: '123456789',
    };
    prismaMock.user.findUnique.mockResolvedValue(null);
    prismaMock.user.create.mockResolvedValue({
      id: 'uuid',
      email: dto.email,
      password: 'hashedpassword',
      name: dto.name,
      surname: dto.surname,
      phone: dto.phone,
      role: 'ADMIN',
    });

    // Act
    const result = await service.createAdmin(dto);

    // Assert
    expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
      where: { email: dto.email },
    });
    expect(bcrypt.hash).toHaveBeenCalledWith(dto.password, 10);
    expect(prismaMock.user.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          email: dto.email,
          password: 'hashedpassword',
          role: 'ADMIN',
        }),
      }),
    );

    expect(result.email).toBe(dto.email);
    expect(result.password).toBe('hashedpassword');
  });

  it('should throw ConflictException if admin already exists', async () => {
    // Arrange
    const dto = {
      email: 'admin@test.com',
      password: 'password123',
      name: 'Admin',
      surname: 'Test',
      phone: '123456789',
    };
    prismaMock.user.findUnique.mockResolvedValue({ id: 'existing-id' });

    // Act & Assert
    await expect(service.createAdmin(dto)).rejects.toThrow(ConflictException);

    // Verifica que no se llame a create ni a bcrypt.hash si ya existe
    expect(prismaMock.user.create).not.toHaveBeenCalled();
    expect(bcrypt.hash).not.toHaveBeenCalled();
  });

  it('should throw if bcrypt.hash fails', async () => {
    // Arrange
    const dto = {
      email: 'newadmin@test.com',
      password: 'password123',
      name: 'Admin',
      surname: 'Test',
      phone: '123456789',
    };
    prismaMock.user.findUnique.mockResolvedValue(null);
    (bcrypt.hash as jest.Mock).mockRejectedValueOnce(new Error('Hash error'));

    // Act & Assert
    await expect(service.createAdmin(dto)).rejects.toThrow('Hash error');

    // Verifica que no se llame a prisma.create si hash falla
    expect(prismaMock.user.create).not.toHaveBeenCalled();
  });
});
