import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateCourtDto } from '../dto/create-court.dto';
import { CourtRepository } from '../repositories/court.repository';
import { CourtValidatorService } from '../validators/court.validator';

@Injectable()
export class CourtsService {
  constructor(
    private readonly repo: CourtRepository,
    private readonly validator: CourtValidatorService,
  ) {}

  async create(dto: CreateCourtDto) {
    await this.validator.validateCreate(dto);
    try {
      return await this.repo.create(dto);
    } catch (err) {
      throw new InternalServerErrorException('Error al crear la cancha.');
    }
  }

  async findAll() {
    try {
      return await this.repo.findAllCourts();
    } catch (err) {
      throw new InternalServerErrorException('Error al obtener las canchas.');
    }
  }
}
