import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCourtDto } from './dto/create-court.dto';

@Injectable()
export class CourtsService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateCourtDto) {
    return this.prisma.court.create({
      data,
    });
  }

  findAll() {
    return this.prisma.court.findMany();
  }
}
