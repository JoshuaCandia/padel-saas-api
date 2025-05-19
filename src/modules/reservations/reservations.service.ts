// src/reservations/reservations.service.ts

import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { PrismaService } from '@/modules/prisma/prisma.service';
import { ReservationValidatorService } from '@/common/services/reservation-validator.service';

@Injectable()
export class ReservationsService {
  constructor(
    private prisma: PrismaService,
    private validator: ReservationValidatorService,
  ) {}

  async createReservation(dto: CreateReservationDto) {
    const start = new Date(dto.start);
    const end = new Date(dto.end);

    if (start >= end) {
      throw new Error('La hora de inicio debe ser anterior a la hora de fin.');
    }

    await this.validator.validateAvailability(dto.courtId, start, end);

    return this.prisma.reservation.create({
      data: {
        ...dto,
        start,
        end,
      },
    });
  }

  async findAll() {
    return this.prisma.reservation.findMany();
  }

  async findByDate(start: string) {
    if (!start) {
      return [];
    }

    const startDate = new Date(start);
    const endDate = new Date(startDate);
    endDate.setHours(23, 59, 59, 999);

    return this.prisma.reservation.findMany({
      where: {
        start: {
          gte: startDate,
          lte: endDate,
        },
      },
    });
  }
}
