import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/infraestructure/prisma/prisma.service';
import { Court, CourtFeature } from '@prisma/client';
import { CreateCourtDto } from '../dto/create-court.dto';

@Injectable()
export class CourtRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByName(name: string): Promise<Court | null> {
    return this.prisma.court.findUnique({
      where: { name },
    });
  }

  async create(dto: CreateCourtDto): Promise<Court> {
    return this.prisma.court.create({
      data: {
        name: dto.name,
        isIndoor: dto.isIndoor,
        isActive: dto.isActive ?? true,
        hourlyRate: dto.hourlyRate,
        features: dto.features || [],
      },
    });
  }

  findAllCourts(): Promise<Court[]> {
    return this.prisma.court.findMany();
  }
}
