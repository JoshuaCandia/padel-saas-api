// src/reservations/__tests__/reservations.service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { ReservationsService } from '../services/reservations.service';
import { PrismaService } from '@/common/infraestructure/prisma/prisma.service';

describe('ReservationsService', () => {
  let service: ReservationsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservationsService,
        {
          provide: PrismaService,
          useValue: {
            reservation: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<ReservationsService>(ReservationsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should create a reservation', async () => {
    const dto = {
      courtId: '1',
      date: '2025-05-20',
      phone: '1234567890',
      name: 'Juan',
      surname: 'Pérez',
      email: 'juan@example.com',
      isPermanent: false,
    };

    jest.spyOn(prisma.reservation, 'create').mockResolvedValue(dto as any);
    const result = await service.createReservation(dto as any);
    expect(result).toEqual(dto);
  });

  it('should return all reservations', async () => {
    const mockReservations = [{ id: '1' }, { id: '2' }];
    jest
      .spyOn(prisma.reservation, 'findMany')
      .mockResolvedValue(mockReservations as any);
    const result = await service.findAll();
    expect(result).toHaveLength(2);
  });
});
