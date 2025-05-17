import { Module } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { PrismaModule } from '@/prisma/prisma.module';
import { PrismaService } from '@/prisma/prisma.service';

@Module({
  imports: [PrismaModule],
  providers: [ReservationsService, PrismaService],
  controllers: [ReservationsController],
})
export class ReservationsModule {}
