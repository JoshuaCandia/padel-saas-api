// src/reservations/reservations.service.ts

import { Injectable } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class ReservationsService {
  constructor(private prisma: PrismaService) {}

  async createReservation(dto: CreateReservationDto) {
    return this.prisma.reservation.create({ data: dto });
  }

  async findAll() {
    return this.prisma.reservation.findMany();
  }

  async findByDate(date: string) {
    return this.prisma.reservation.findMany({ where: { date } });
  }
}
