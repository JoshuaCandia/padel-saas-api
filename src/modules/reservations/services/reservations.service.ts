// src/reservations/reservations.service.ts
import { Injectable } from '@nestjs/common';
import { CreateReservationDto } from '../dto/create-reservation.dto';
import { ReservationsRepository } from '../repositories/reservations.repository';
import { ReservationValidatorService } from '../validators/reservation-validator.service';

@Injectable()
export class ReservationsService {
  constructor(
    private repository: ReservationsRepository,
    private validator: ReservationValidatorService,
  ) {}

  async createReservation(dto: CreateReservationDto) {
    const start = new Date(dto.start);
    const end = new Date(dto.end);

    if (start >= end) {
      throw new Error('La hora de inicio debe ser anterior a la hora de fin.');
    }

    await this.validator.validateAvailability(dto.courtId, start, end);

    return this.repository.create({
      ...dto,
      start,
      end,
    });
  }

  async findAll() {
    return this.repository.findAll();
  }

  async findByDate(start: string) {
    if (!start) {
      return [];
    }

    const startDate = new Date(start);
    const endDate = new Date(startDate);
    endDate.setHours(23, 59, 59, 999);

    return this.repository.findByDateRange(startDate, endDate);
  }
}
