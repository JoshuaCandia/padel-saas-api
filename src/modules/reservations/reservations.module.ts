// src/reservations/reservations.module.ts
import { Module } from '@nestjs/common';
import { ReservationsService } from './services/reservations.service';
import { ReservationValidatorService } from './validators/reservation-validator.service';
import { ReservationsRepository } from './repositories/reservations.repository';
import { PrismaModule } from '@/common/infraestructure/prisma/prisma.module';
import { ReservationsController } from './controllers/reservations.controller';

@Module({
  controllers: [ReservationsController],
  imports: [PrismaModule],
  providers: [
    ReservationsService,
    ReservationsRepository,
    ReservationValidatorService,
  ],
  exports: [ReservationsService],
})
export class ReservationsModule {}
