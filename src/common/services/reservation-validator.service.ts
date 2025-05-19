import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/modules/prisma/prisma.service';

@Injectable()
export class ReservationValidatorService {
  constructor(private prisma: PrismaService) {}

  async validateAvailability(courtId: string, start: Date, end: Date) {
    const overlapping = await this.prisma.reservation.findFirst({
      where: {
        courtId,
        OR: [
          {
            start: { lt: end },
            end: { gt: start },
          },
        ],
      },
    });

    if (overlapping) {
      throw new Error('Ya hay una reserva en ese horario para esta cancha.');
    }
  }
}
