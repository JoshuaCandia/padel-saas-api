import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/infraestructure/prisma/prisma.service';
import {
  CreateReservationDto,
  ReservationInput,
} from '../dto/create-reservation.dto';

@Injectable()
export class ReservationsRepository {
  constructor(private prisma: PrismaService) {}

  create(data: ReservationInput & { start: Date; end: Date }) {
    return this.prisma.reservation.create({ data });
  }

  findAll() {
    return this.prisma.reservation.findMany();
  }

  findByDateRange(start: Date, end: Date) {
    return this.prisma.reservation.findMany({
      where: {
        start: {
          gte: start,
          lte: end,
        },
      },
    });
  }
}
