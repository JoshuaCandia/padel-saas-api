import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '@/auth/auth.service';
import { UsersService } from '@/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';
import { Role } from '@prisma/client';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findByPhone: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('jwt-token'),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should validate user with correct credentials', async () => {
    const user = {
      id: 'uuid',
      phone: '1234567890',
      password: await bcrypt.hash('password123', 10),
      name: 'Test',
      surname: 'User',
      email: null,
      role: Role.USER,
    };
    jest.spyOn(usersService, 'findByPhone').mockResolvedValue(user);

    const result = await service.validateUser('1234567890', 'password123');
    expect(result).toMatchObject({ phone: '1234567890' });
  });

  it('should throw UnauthorizedException with incorrect password', async () => {
    const user = {
      id: 'uuid',
      phone: '1234567890',
      password: await bcrypt.hash('password123', 10),
      name: 'Test',
      surname: 'User',
      email: null,
      role: Role.USER,
    };
    jest.spyOn(usersService, 'findByPhone').mockResolvedValue(user);

    await expect(
      service.validateUser('1234567890', 'wrongpassword'),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException if user not found', async () => {
    jest.spyOn(usersService, 'findByPhone').mockResolvedValue(null);

    await expect(
      service.validateUser('nonexistent', 'password123'),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should return jwt token on login', async () => {
    const user = {
      id: 'uuid',
      phone: '1234567890',
    };
    const token = await service.login(user as any);
    expect(token).toEqual({ access_token: 'jwt-token' });
    expect(jwtService.sign).toHaveBeenCalledWith({
      phone: user.phone,
      sub: user.id,
    });
  });
});
