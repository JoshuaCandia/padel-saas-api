import { Test, TestingModule } from '@nestjs/testing';
import { AdminService } from '@/admin/admin.service';
import { PrismaService } from '@/prisma/prisma.service';
import { ConflictException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  ...jest.requireActual('bcrypt'),
  hash: jest.fn(),
}));

const prismaMock = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
  reservation: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    delete: jest.fn(),
    update: jest.fn(),
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

  describe('createAdmin', () => {
    it('should create an admin successfully', async () => {
      const dto = {
        email: 'admin@test.com',
        password: 'password123',
        name: 'Admin',
        surname: 'Test',
        phone: '123456789',
      };

      prismaMock.user.findUnique.mockResolvedValue(null);
      prismaMock.user.create.mockResolvedValue({
        ...dto,
        id: 'uuid',
        password: 'hashedpassword',
        role: 'ADMIN',
      });

      const result = await service.createAdmin(dto);

      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: { email: dto.email },
      });
      expect(bcrypt.hash).toHaveBeenCalledWith(dto.password, 10);
      expect(prismaMock.user.create).toHaveBeenCalled();
      expect(result.role).toBe('ADMIN');
    });

    it('should throw ConflictException if admin already exists', async () => {
      const dto = {
        email: 'admin@test.com',
        password: 'password123',
        name: 'Admin',
        surname: 'Test',
        phone: '123456789',
      };

      prismaMock.user.findUnique.mockResolvedValue({ id: 'existing-id' });

      await expect(service.createAdmin(dto)).rejects.toThrow(ConflictException);
      expect(prismaMock.user.create).not.toHaveBeenCalled();
      expect(bcrypt.hash).not.toHaveBeenCalled();
    });

    it('should throw if bcrypt.hash fails', async () => {
      const dto = {
        email: 'newadmin@test.com',
        password: 'password123',
        name: 'Admin',
        surname: 'Test',
        phone: '123456789',
      };

      prismaMock.user.findUnique.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockRejectedValueOnce(new Error('Hash error'));

      await expect(service.createAdmin(dto)).rejects.toThrow('Hash error');
      expect(prismaMock.user.create).not.toHaveBeenCalled();
    });
  });

  describe('Reservation Management', () => {
    it('should return all reservations', async () => {
      const reservations = [{ id: '1' }, { id: '2' }];
      prismaMock.reservation.findMany.mockResolvedValue(reservations);

      const result = await service.findAllReservations();

      expect(prismaMock.reservation.findMany).toHaveBeenCalled();
      expect(result).toEqual(reservations);
    });

    it('should delete a reservation if it exists', async () => {
      const reservation = { id: '123', name: 'Juan' };

      prismaMock.reservation.findUnique.mockResolvedValue(reservation);
      prismaMock.reservation.delete.mockResolvedValue(reservation);

      const result = await service.deleteReservation('123');

      expect(prismaMock.reservation.findUnique).toHaveBeenCalledWith({
        where: { id: '123' },
      });
      expect(prismaMock.reservation.delete).toHaveBeenCalledWith({
        where: { id: '123' },
      });
      expect(result).toEqual(reservation);
    });

    it('should throw NotFoundException if reservation does not exist', async () => {
      prismaMock.reservation.findUnique.mockResolvedValue(null);

      await expect(service.deleteReservation('notfound')).rejects.toThrow(
        NotFoundException,
      );
      expect(prismaMock.reservation.delete).not.toHaveBeenCalled();
    });

    it('should mark reservation as absent', async () => {
      const id = 'res-456';
      const updated = { id, isAbsent: true };

      prismaMock.reservation.findUnique.mockResolvedValue({
        id,
        isAbsent: false,
      });
      prismaMock.reservation.update.mockResolvedValue(updated);

      const result = await service.markAsAbsent(id);

      expect(prismaMock.reservation.update).toHaveBeenCalledWith({
        where: { id },
        data: { isAbsent: true },
      });

      expect(result).toEqual(updated);
    });

    it('should throw NotFoundException when marking absent if reservation does not exist', async () => {
      prismaMock.reservation.findUnique.mockResolvedValue(null);

      await expect(service.markAsAbsent('invalid')).rejects.toThrow(
        NotFoundException,
      );
      expect(prismaMock.reservation.update).not.toHaveBeenCalled();
    });
  });
});
