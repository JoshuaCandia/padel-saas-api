// src/modules/auth/__tests__/auth.service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../services/auth.service';
import { AuthRepository } from '../repositories/auth.repository';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';
import { Role, User } from '@prisma/client';

describe('AuthService', () => {
  let service: AuthService;
  let authRepo: AuthRepository;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: AuthRepository,
          useValue: {
            findByEmail: jest.fn(),
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
    authRepo = module.get<AuthRepository>(AuthRepository);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should validate user with correct credentials', async () => {
    // Preparamos un user con password hasheado
    const plain = 'password123';
    const hashed = await bcrypt.hash(plain, 10);
    const user: User = {
      id: 'uuid',
      email: 'test@example.com',
      phone: '1234567890',
      password: hashed,
      name: 'Test',
      surname: 'User',
      role: Role.USER,
    };

    jest.spyOn(authRepo, 'findByEmail').mockResolvedValue(user);

    const result = await service.validateUser(user.email ?? '', plain);
    // El resultado no debe contener password
    expect((result as any).password).toBeUndefined();
    expect(result).toMatchObject({
      id: user.id,
      email: user.email,
      phone: user.phone,
      name: user.name,
      surname: user.surname,
      role: user.role,
    });
  });

  it('should throw UnauthorizedException if email is empty', async () => {
    await expect(service.validateUser('', 'any')).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should throw UnauthorizedException if user not found', async () => {
    jest.spyOn(authRepo, 'findByEmail').mockResolvedValue(null);
    await expect(
      service.validateUser('noone@example.com', 'pass'),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException with incorrect password', async () => {
    const hashed = await bcrypt.hash('rightpass', 10);
    const user: User = {
      id: 'uuid',
      email: 'test@example.com',
      phone: '1234567890',
      password: hashed,
      name: 'Test',
      surname: 'User',
      role: Role.USER,
    };
    jest.spyOn(authRepo, 'findByEmail').mockResolvedValue(user);

    await expect(
      service.validateUser(user.email ?? '', 'wrongpass'),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should return jwt token on login', async () => {
    const payloadUser = { id: 'uuid', phone: '1234567890', role: Role.ADMIN };
    const token = await service.login(payloadUser);
    expect(token).toEqual({ access_token: 'jwt-token' });
    expect(jwtService.sign).toHaveBeenCalledWith({
      phone: payloadUser.phone,
      sub: payloadUser.id,
      role: payloadUser.role,
    });
  });
});
