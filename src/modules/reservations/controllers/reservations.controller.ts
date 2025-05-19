import { Controller, Post, Body, Get, Put, Param, Query } from '@nestjs/common';
import { ReservationsService } from '../services/reservations.service';
import { CreateReservationDto } from '../dto/create-reservation.dto';

@Controller('reservations')
export class ReservationsController {
  constructor(private reservationsService: ReservationsService) {}

  @Post()
  async create(@Body() dto: CreateReservationDto) {
    return this.reservationsService.createReservation(dto);
  }

  @Get()
  async findAll() {
    return this.reservationsService.findAll();
  }

  @Get()
  async findByDate(@Query('start') start: string) {
    return this.reservationsService.findByDate(start);
  }
}
