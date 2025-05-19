import { NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/common/infraestructure/prisma/prisma.service';

export class DbUtilsService {
  constructor(private prisma: PrismaService) {}

  async ensureCourtExists(courtId: string) {
    const court = await this.prisma.court.findUnique({
      where: { id: courtId },
    });
    if (!court) {
      throw new NotFoundException(`La cancha con ID ${courtId} no existe.`);
    }
    return court;
  }
}
