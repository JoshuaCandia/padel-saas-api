import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/infraestructure/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class AdminRepository {
  constructor(private readonly prisma: PrismaService) {}

  findUserByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  createUser(data: Prisma.UserCreateInput) {
    return this.prisma.user.create({ data });
  }

  findAllReservations() {
    return this.prisma.reservation.findMany();
  }

  findReservationById(id: string) {
    return this.prisma.reservation.findUnique({ where: { id } });
  }

  updateReservation(id: string, data: Prisma.ReservationUpdateInput) {
    return this.prisma.reservation.update({ where: { id }, data });
  }

  deleteReservation(id: string) {
    return this.prisma.reservation.delete({ where: { id } });
  }
}
