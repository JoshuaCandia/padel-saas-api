import { Module } from '@nestjs/common';
import { ReservationsService } from './services/reservations.service';
import { ReservationsController } from './controllers/reservations.controller';
import { PrismaModule } from '@/common/infraestructure/prisma/prisma.module';
import { PrismaService } from '@/common/infraestructure/prisma/prisma.service';
import { ReservationValidatorService } from './validators/reservation-validator.service';

@Module({
  imports: [PrismaModule],
  providers: [ReservationsService, PrismaService, ReservationValidatorService],
  controllers: [ReservationsController],
})
export class ReservationsModule {}
