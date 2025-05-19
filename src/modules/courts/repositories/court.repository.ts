import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/infraestructure/prisma/prisma.service';
import { Prisma, Court } from '@prisma/client';

@Injectable()
export class CourtsRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByName(name: string): Promise<Court | null> {
    return this.prisma.court.findUnique({ where: { name } });
  }

  createCourt(data: Prisma.CourtCreateInput): Promise<Court> {
    return this.prisma.court.create({ data });
  }

  findAllCourts(): Promise<Court[]> {
    return this.prisma.court.findMany();
  }
}
