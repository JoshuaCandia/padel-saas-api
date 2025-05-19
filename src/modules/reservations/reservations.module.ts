import { Module } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { PrismaModule } from '@/common/infraestructure/prisma/prisma.module';
import { PrismaService } from '@/common/infraestructure/prisma/prisma.service';
import { ReservationValidatorService } from '@/common/services/reservation-validator.service';

@Module({
  imports: [PrismaModule],
  providers: [ReservationsService, PrismaService, ReservationValidatorService],
  controllers: [ReservationsController],
})
export class ReservationsModule {}
